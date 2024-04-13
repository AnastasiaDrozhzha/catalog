package adrozhzha.catalog.service;

import adrozhzha.catalog.dao.TemplateDao;
import adrozhzha.catalog.model.Page;
import adrozhzha.catalog.model.Template;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static java.util.Objects.requireNonNullElse;

@Service
@Transactional
public class TemplateService {

    private static final Integer DEFAULT_OFFSET = 0;
    private static final Integer DEFAULT_PAGE_SIZE = 50;

    private final TemplateDao templateDao;

    public TemplateService(TemplateDao templateDao) {
        this.templateDao = templateDao;
    }

    public Page<Template> search(String search, Integer offset, Integer pageSize) {
        List<Template> results = templateDao.search(
                requireNonNullElse(search, ""),
                requireNonNullElse(offset, DEFAULT_OFFSET),
                requireNonNullElse(pageSize, DEFAULT_PAGE_SIZE));
        int totalCount = templateDao.totalCount(requireNonNullElse(search, ""));

        return new Page<>(results, totalCount);
    }

    public Template create(Template template) {
        return templateDao.create(template);
    }

    public Template update(Template template) {
        if (template.getId() != null) {
            return templateDao.update(template);
        } else {
            throw new RuntimeException("Unable to update entity with null id");
        }
    }

    public void deleteById(Integer templateId) {
        templateDao.deleteById(templateId);
    }

    public Template findById(Integer templateId) {
        return templateDao.findById(templateId);
    }
}
