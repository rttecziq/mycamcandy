import { Injectable } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { map, filter, switchMap } from "rxjs/operators";

@Injectable({
  // we declare that this service should be created
  // by the root application injector.
  providedIn: "root"
})
export class TitleService {
  site_settings: any[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {
    this.site_settings = JSON.parse(localStorage.getItem("site_settings"));

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter(route => route.outlet === "primary"),
        switchMap(route => route.data)
      )
      .subscribe(event => {
        if (this.site_settings) {
          let site_name = this.site_settings.filter(obj => {
            // console.log("site_settings", this.site_settings);
            return obj.key === "site_name";
          });
          site_name = site_name.length > 0 ? site_name[0].value : "";
          this.titleService.setTitle(site_name + " - " + event["title"]);
        }
      });
  }
}
