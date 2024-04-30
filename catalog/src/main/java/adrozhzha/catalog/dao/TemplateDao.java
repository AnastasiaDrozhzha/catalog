package adrozhzha.catalog.dao;

import adrozhzha.catalog.db.tables.records.TemplateRecord;
import adrozhzha.catalog.model.NotFoundException;
import adrozhzha.catalog.model.Property;
import adrozhzha.catalog.model.PropertyType;
import adrozhzha.catalog.model.Template;
import org.jooq.DSLContext;
import org.jooq.Query;
import org.jooq.Record1;
import org.jooq.Result;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

import static adrozhzha.catalog.db.Tables.*;
import static org.jooq.impl.DSL.selectFrom;

@Repository
public class TemplateDao {
    public static final String ENTITY_NAME = Template.class.getSimpleName();
    private final DSLContext create;

    public TemplateDao(DSLContext dslContext) {
        this.create = dslContext;
    }

    public List<Template> search(String search, Integer offset, Integer pageSize) {
        Result<TemplateRecord> results = create.selectFrom(TEMPLATE)
                .where(Utils.search(TEMPLATE.NAME, search))
                .orderBy(TEMPLATE.NAME)
                .offset(offset)
                .limit(pageSize)
                .fetch();

        return results.stream().map(this::toTemplate).toList();
    }

    private Template toTemplate(TemplateRecord templateRecord) {
        Template template = new Template();
        template.setId(templateRecord.getId());
        template.setName(templateRecord.getName());
        return template;
    }

    public int totalCount(String search) {
        return create.fetchCount(
                selectFrom(TEMPLATE)
                .where(Utils.search(TEMPLATE.NAME, search)));

    }

    public Template create(Template template) {
        Record1<Integer> record =
                create.insertInto(TEMPLATE, TEMPLATE.NAME)
                        .values(template.getName())
                        .returningResult(TEMPLATE.ID)
                        .fetchOne();
        if (record != null) {
            Integer templateId = record.getValue(TEMPLATE.ID);
            template.setId(templateId);

            updateProperties(template);
            fetchProperties(template);
        } else {
            throw new RuntimeException("Insert returned null record");
        }
        return template;
    }

    public Template update(Template template) {
        int rowNum = create.update(TEMPLATE)
                .set(TEMPLATE.NAME, template.getName())
                .where(TEMPLATE.ID.eq(template.getId()))
                .execute();
        if (rowNum == 0) {
            throw new NotFoundException(ENTITY_NAME, template.getId());
        } else if (rowNum != 1) {
            throw new RuntimeException("Number of records updated is not equal to 1");
        } else {
            updateProperties(template);
            fetchProperties(template);
        }
        return template;
    }

    private void updateProperties(Template template) {
        create.deleteFrom(TEMPLATE_PROPERTY).where(TEMPLATE_PROPERTY.TEMPLATE_ID.eq(template.getId())).execute();

        if (!CollectionUtils.isEmpty(template.getProperties())) {
            int i = 0;
            List<Query> inserts = new ArrayList<>(template.getProperties().size());
            for (Property property: template.getProperties()) {
                inserts.add(create.insertInto(TEMPLATE_PROPERTY,
                        TEMPLATE_PROPERTY.TEMPLATE_ID,
                        TEMPLATE_PROPERTY.PROPERTY_ID,
                        TEMPLATE_PROPERTY.INDEX)
                                .values(template.getId(),
                                        property.getId(),
                                        i++));

            }
            create.batch(inserts).execute(); // TODO: introduce batch size?
        }
    }

    public void deleteById(Integer templateId) {
        create.deleteFrom(TEMPLATE).where(TEMPLATE.ID.eq(templateId)).execute();
    }

    public Template findById(Integer templateId) {
        TemplateRecord result = create.selectFrom(TEMPLATE)
                .where(TEMPLATE.ID.eq(templateId))
                .fetchOne();
        if (result == null) {
            throw new NotFoundException(ENTITY_NAME, templateId);
        }
        Template template = toTemplate(result);
        fetchProperties(template);
        return template;
    }

    private void fetchProperties(Template template) {
        var propertyRecords = create.select(TEMPLATE_PROPERTY.PROPERTY_ID, PROPERTY.NAME, PROPERTY.TYPE)
                .from(TEMPLATE_PROPERTY)
                .join(PROPERTY)
                .on(TEMPLATE_PROPERTY.TEMPLATE_ID.eq(template.getId())
                        .and(TEMPLATE_PROPERTY.PROPERTY_ID.eq(PROPERTY.ID)))
                .orderBy(TEMPLATE_PROPERTY.INDEX)
                .fetch();
        List<Property> properties = new ArrayList<>(propertyRecords.size());
        for (var propertyRecord: propertyRecords) {
            Property property = new Property();
            property.setId(propertyRecord.get(TEMPLATE_PROPERTY.PROPERTY_ID));
            property.setName(propertyRecord.get(PROPERTY.NAME));
            property.setType(PropertyType.fromString(propertyRecord.get(PROPERTY.TYPE)));
            properties.add(property);
        }
        template.setProperties(properties);
    }
}
