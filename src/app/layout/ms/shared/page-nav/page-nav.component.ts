import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnChanges, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { TitleService, ALAIN_I18N_TOKEN, MenuService } from '@delon/theme';

import { I18NService } from '@core';

import { BrandService } from '../../ms.service';
import { MSMenu, MSServiceNavConfig } from '../../ms.interfaces';

@Component({
  selector: 'page-nav',
  templateUrl: './page-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MSPageNavComponent implements OnChanges {
  private _config: MSServiceNavConfig = {};
  @Input()
  set config(val: MSServiceNavConfig) {
    const { title, titleI18n, backHref, doc, docI18n } = val;
    this.titSrv.setTitle(docI18n ? this.i18n.fanyi(docI18n) : doc);
    this._config.title = titleI18n ? this.i18n.fanyi(titleI18n) : title;
    this._config.backHref = backHref || '';
  }
  get config() {
    return this._config;
  }

  private _menus: MSMenu[] = [];
  @Input()
  set list(list: MSMenu[]) {
    this.menuSrv.add(list);
    this.menuSrv.visit(list, i => (i.active = true));
    this._menus = this.menuSrv.menus;
  }
  get list() {
    return this._menus;
  }

  constructor(
    private srv: BrandService,
    private router: Router,
    private titSrv: TitleService,
    private menuSrv: MenuService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private cdr: ChangeDetectorRef,
  ) {}

  to(url: string, e: MouseEvent) {
    e.preventDefault();
    if (!url) return;
    this.router.navigateByUrl(url);
  }

  toggle() {
    this.srv.hideNav = !this.srv.hideNav;
    this.srv.triggerNotify('page-nav');
  }

  ngOnChanges() {
    this.cdr.detectChanges();
  }
}
