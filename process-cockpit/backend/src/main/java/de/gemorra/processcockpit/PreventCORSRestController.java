package de.gemorra.processcockpit;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping(path = "rest")
public class PreventCORSRestController {

    RestTemplate restTemplate = new RestTemplate();

    @GetMapping(path = "test")
    public String test(){
        return "SUCCESS";
    }

    @GetMapping(path = "cors")
    public Object cors(@RequestParam String restCall){
        return restTemplate.getForObject("http://"+restCall.replace("---","?").replace("-U-","&"),Object.class);
    }

    @PostMapping(path = "cors")
    public Object cors(@RequestParam String restCall, @RequestBody Object requestBody){
        return restTemplate.postForObject("http://"+restCall.replace("---","?").replace("-U-","&"),requestBody,Object.class);
    }

    @PutMapping(path = "cors")
    public void corsPut(@RequestParam String restCall, @RequestBody Object requestBody){
        restTemplate.put("http://"+restCall.replace("---","?").replace("-U-","&"),requestBody,Object.class);
    }
    @DeleteMapping(path = "cors")
    public void corsDelete(@RequestParam String restCall, @RequestBody(required = false) Object requestBody ){
        restTemplate.delete("http://"+restCall.replace("---","?").replace("-U-","&"),requestBody,Object.class);
    }
}
