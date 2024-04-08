package adrozhzha.catalog;

import adrozhzha.catalog.dao.AccountDao;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class GreetingController {

    private final AccountDao accountDao;

    public GreetingController(AccountDao accountDao) {
        this.accountDao = accountDao;
    }

    @GetMapping("/greeting")
    public String greeting(@RequestParam(name="name", required=false, defaultValue="World") String name, Model model) {
        String accountName = accountDao.findUsername().orElse(name);
        model.addAttribute("name", accountName);
        return "greeting";
    }

}