package fi.vm.sade.valintaperusteet.controller;

import org.springframework.web.bind.annotation.GetMapping;

public class UIController {

  @GetMapping(value = {"/"})
  public String getIndex() {
    return "/index.html";
  }
}
