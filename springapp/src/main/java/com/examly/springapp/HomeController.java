package com.examly.springapp;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
public class HomeController {

    @RequestMapping(method=RequestMethod.GET, value="/home")
    public String sayHome() {
        return "Home";
    }
}