package adrozhzha.catalog.dao;

import adrozhzha.catalog.db.tables.records.TemplateRecord;
import adrozhzha.catalog.model.Template;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.jooq.Result;
import org.springframework.stereotype.Repository;

import java.util.List;

import static adrozhzha.catalog.db.Tables.TEMPLATE;
import static org.jooq.impl.DSL.selectFrom;

@Repository
public class TemplateDao {
    private final DSLContext create;

    public TemplateDao(DSLContext dslContext) {
        this.create = dslContext;
    }

    public List<Template> search(String search, Integer offset, Integer pageSize) {
        Result<TemplateRecord> results = create.selectFrom(TEMPLATE)
                .where(TEMPLATE.NAME.like(search + "%")) // TODO: fulltext search
                .orderBy(TEMPLATE.NAME)
                .offset(offset)
                .limit(pageSize)
                .fetch();

        return results.stream().map(this::toTemplate).toList();
    }

    private Template toTemplate(TemplateRecord templateRecord) {
        Template template = new Template();
        template.setId(templateRecord.getId());//TODO: use mapper library here
        template.setName(templateRecord.getName());
        return template;
    }

    public int totalCount(String search) {
        return create.fetchCount(
                selectFrom(TEMPLATE)
                .where(TEMPLATE.NAME.like(search + "%"))); // TODO: fulltext search

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
        if (rowNum != 1) {
            throw new RuntimeException("Number of records updated is not equal to 1");
        }
        return template;
    }

    public void deleteById(Integer templateId) {
        create.deleteFrom(TEMPLATE).where(TEMPLATE.ID.eq(templateId)).execute();
    }

    public Template findById(Integer templateId) {
        TemplateRecord result = create.selectFrom(TEMPLATE)
                .where(TEMPLATE.ID.eq(templateId))
                .fetchOne();
        if (result == null) {
            throw new RuntimeException("Not found"); // TODO: work with exceptions
        }
        return toTemplate(result);
    }
}
