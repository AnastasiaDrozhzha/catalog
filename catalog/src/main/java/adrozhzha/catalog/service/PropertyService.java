package adrozhzha.catalog.service;

import adrozhzha.catalog.dao.PropertyDao;
import adrozhzha.catalog.model.Page;
import adrozhzha.catalog.model.Property;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.Objects.requireNonNullElse;

@Service
public class PropertyService {

    // TODO: consolidate defaults in one place
    private static final Integer DEFAULT_OFFSET = 0;
    private static final Integer DEFAULT_PAGE_SIZE = 50;

    private final PropertyDao propertyDao;

    public PropertyService(PropertyDao propertyDao) {
        this.propertyDao = propertyDao;
    }

    public Page<Property> search(String search, Integer offset, Integer pageSize) {
        List<Property> results = propertyDao.search(
                requireNonNullElse(search, ""),
                requireNonNullElse(offset, DEFAULT_OFFSET),
                requireNonNullElse(pageSize, DEFAULT_PAGE_SIZE));
        int totalCount = propertyDao.totalCount(requireNonNullElse(search, ""));

        return new Page<>(results, totalCount);
    }

    public Property create(Property property) {
        return propertyDao.create(property);
    }

    public Property update(Property property) {
        if (property.getId() != null) {
            return propertyDao.update(property);
        } else {
            throw new RuntimeException("Unable to update entity with null id");
        }
    }

    public void deleteById(Integer propertyId) {
        propertyDao.deleteById(propertyId);
    }

    public Property findById(Integer propertyId) {
        return propertyDao.findById(propertyId);
    }
}
