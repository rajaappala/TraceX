import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    isActive: boolean = false;
    showMenu: string = '';
    pushRightClass: string = 'push-right';
    menu_items: Array<any> = [];

    constructor(private translate: TranslateService, public router: Router) {
        // this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de']);
        // this.translate.setDefaultLang('en');
        // const browserLang = this.translate.getBrowserLang();
        // this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de/) ? browserLang : 'en');

        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });

        let role = sessionStorage.getItem('role');
        switch (role) {
            case 'Admin':
                this.getsidebar(role)
                break;
            case 'Manufacturer':
                this.getsidebar(role)
                break;
            case 'Warehouse':
                this.getsidebar(role)
                break;
            case 'Distributor':
                this.getsidebar(role)
                break;
            case 'Retailer':
                this.getsidebar(role)
                break;
            default:
                break;
        }
    }

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    onLoggedout() {
        sessionStorage.removeItem('isLoggedin');
    }
    getsidebar(role)
    {
        if(role==='Manufacturer'){
            return this.menu_items.push(
                this.getdashboard(),this.getmanufacturer(),this.getwarehouse(),this.getdistributor(),this.getretailer(),this.getproduct(),this.gettracker()
            );
        }else{
            return this.menu_items.push(
                this.getdashboard(),this.getmanufacturer(),this.getwarehouse(),this.getdistributor(),this.getretailer(),this.gettracker()
            );
        }
    }
    getdashboard()
    {
        return {
                    routepath: '/dashboard',
                    label: 'Dashboard',
                    icon:'fa-list-alt'
                }
    }

    getmanufacturer()
    {
        return {
                    routepath: '/manufacture',
                    label: 'Manufacturers',
                    icon:'fa-linode'
                }
    }

    getwarehouse()
    {
        return {
                    routepath: '/warehouse',
                    label: 'Warehouses',
                    icon:'fa-home'
                }
    }

    getdistributor()
    {
        return {
                    routepath: '/distributor',
                    label: 'Distributors',
                    icon:'fa-truck'
                }
    }

    getretailer()
    {
        return {
                    routepath: '/retailer',
                    label: 'Retailers',
                    icon:'fa-stack-exchange'
                }
    }

    getproduct()
    {
        return {
                    routepath: '/product',
                    label: 'Product',
                    icon:'fa-medkit'
                }
    }

    gettracker()
    {
        return {
                    routepath: '/tracker',
                    label: 'Trace Product',
                    icon:'fa-search'
                }
    }
}
