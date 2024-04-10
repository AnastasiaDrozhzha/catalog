package adrozhzha.catalog.controller;

import adrozhzha.catalog.dao.AccountDao;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@CrossOrigin(origins = "http://localhost:4200")
public class GreetingController {

    private final AccountDao accountDao;

    public GreetingController(AccountDao accountDao) {
        this.accountDao = accountDao;
    }

    @GetMapping("/greeting")
    public String greeting(@RequestParam(name="name", required=false, defaultValue="World") String name, Model model) {
        String accountName = findAccountName(name);
        model.addAttribute("name", accountName);
        return "greeting";
    }

    @GetMapping(value = "/greeting_json", produces = "application/json")
    public @ResponseBody Map<String, String> getBook(@RequestParam(name="name", required=false, defaultValue="World") String name) {
        return Map.of("name", findAccountName(name));
    }

    private String findAccountName(String name) {
        return accountDao.findUsername().orElse(name);
    }

}