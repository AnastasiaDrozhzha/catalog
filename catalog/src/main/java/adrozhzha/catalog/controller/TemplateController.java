package adrozhzha.catalog.controller;

import adrozhzha.catalog.model.Page;
import adrozhzha.catalog.model.Template;
import adrozhzha.catalog.service.TemplateService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class TemplateController {

    private final TemplateService templateService;

    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    @GetMapping(value = "/templates", produces = "application/json")
    public Page<Template> search(@RequestParam(name="search", required=false) String searchStr,
                                 @RequestParam(name="offset", required = false) Integer offset,
                                 @RequestParam(name="pageSize", required = false) Integer pageSize) {
        return templateService.search(searchStr, offset, pageSize);
    }

    @GetMapping(value = "/templates/{id}", produces = "application/json")
    public Template read(@PathVariable Integer id) {
        return templateService.findById(id);
    }

    @PostMapping(value = "/templates", produces = "application/json")
    public Template create(@RequestBody Template template) {
        return this.templateService.create(template);
    }

    @PutMapping(value = "/templates/{id}", produces = "application/json")
    public Template update(@RequestBody Template template, @PathVariable Integer id) {
        template.setId(id);
        return this.templateService.update(template);
    }

    @DeleteMapping("/templates/{id}")
    public void delete(@PathVariable Integer id) {
        this.templateService.deleteById(id);
    }
}
