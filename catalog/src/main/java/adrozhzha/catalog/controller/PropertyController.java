package adrozhzha.catalog.controller;

import adrozhzha.catalog.model.Page;
import adrozhzha.catalog.model.Property;
import adrozhzha.catalog.service.PropertyService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping(value = "/properties", produces = "application/json")
    public Page<Property> search(@RequestParam(name="search", required=false) String searchStr,
                                 @RequestParam(name="offset", required = false) Integer offset,
                                 @RequestParam(name="pageSize", required = false) Integer pageSize) {
        return propertyService.search(searchStr, offset, pageSize);
    }

    @GetMapping(value = "/properties/{id}", produces = "application/json")
    public Property read(@PathVariable Integer id) {
        return propertyService.findById(id);
    }

    @PostMapping(value = "/properties", produces = "application/json")
    public Property create(@RequestBody Property property) {
        return this.propertyService.create(property);
    }

    @PutMapping(value = "/properties/{id}", produces = "application/json")
    public Property update(@RequestBody Property property, @PathVariable Integer id) {
        property.setId(id);
        return this.propertyService.update(property);
    }

    @DeleteMapping("/properties/{id}")
    public void delete(@PathVariable Integer id) {
        this.propertyService.deleteById(id);
    }
}
