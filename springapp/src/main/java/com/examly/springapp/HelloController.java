package com.examly.springapp;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
public class HelloController {
    
    @RequestMapping(method=RequestMethod.GET, value="/hello")
    public String sayHello() {
        return "Hello";
    }
    
}
