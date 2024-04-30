package adrozhzha.catalog.dao;

import adrozhzha.catalog.db.tables.records.PropertyRecord;
import adrozhzha.catalog.model.NotFoundException;
import adrozhzha.catalog.model.Property;
import adrozhzha.catalog.model.PropertyType;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.jooq.Result;
import org.springframework.stereotype.Repository;

import java.util.List;

import static adrozhzha.catalog.db.Tables.PROPERTY;
import static org.jooq.impl.DSL.selectFrom;

@Repository
public class PropertyDao {

    public static final String ENTITY_NAME = Property.class.getSimpleName();
    private final DSLContext create;

    public PropertyDao(DSLContext dslContext) {
        this.create = dslContext;
    }

    public List<Property> search(String search, Integer offset, Integer pageSize) {
        Result<PropertyRecord> results = create.selectFrom(PROPERTY)
                .where(Utils.search(PROPERTY.NAME, search))
                .orderBy(PROPERTY.NAME)
                .offset(offset)
                .limit(pageSize)
                .fetch();

        return results.stream().map(this::toProperty).toList();
    }

    private Property toProperty(PropertyRecord propertyRecord) {
        Property property = new Property();
        property.setId(propertyRecord.getId());
        property.setName(propertyRecord.getName());
        property.setType(PropertyType.fromString(propertyRecord.getType()));
        return property;
    }

    public int totalCount(String search) {
        return create.fetchCount(
                selectFrom(PROPERTY)
                        .where(Utils.search(PROPERTY.NAME, search)));

    }

    public Property create(Property property) {
        Record1<Integer> record =
                create.insertInto(PROPERTY, PROPERTY.NAME, PROPERTY.TYPE)
                        .values(property.getName(), property.getType().getValue())
                        .returningResult(PROPERTY.ID)
                        .fetchOne();
        if (record != null) {
            Integer propertyId = record.getValue(PROPERTY.ID);
            property.setId(propertyId);
        } else {
            throw new RuntimeException("Insert returned null record");
        }
        return property;
    }

    public Property update(Property property) {
        int rowNum = create.update(PROPERTY)
                .set(PROPERTY.NAME, property.getName())
                .set(PROPERTY.TYPE, property.getType().getValue())
                .where(PROPERTY.ID.eq(property.getId()))
                .execute();
        if (rowNum == 0) {
            throw new NotFoundException(ENTITY_NAME, property.getId());
        } else if (rowNum != 1) {
            throw new RuntimeException("Number of records updated is not equal to 1");
        }
        return property;
    }

    public void deleteById(Integer propertyId) {
        create.deleteFrom(PROPERTY).where(PROPERTY.ID.eq(propertyId)).execute();
    }

    public Property findById(Integer propertyId) {
        PropertyRecord result = create.selectFrom(PROPERTY)
                .where(PROPERTY.ID.eq(propertyId))
                .fetchOne();
        if (result == null) {
            throw new NotFoundException(ENTITY_NAME, propertyId);
        }
        return toProperty(result);
    }
}
