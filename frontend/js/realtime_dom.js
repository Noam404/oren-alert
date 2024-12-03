import $ from 'jquery';
import {wait} from './utils';

async function slideRight(element, time) {
    element.animate({width: '100%'}, time);   
}
async function slideRightClose(element, time) {
    element.animate({width: '0'}, time);
}

class Area {
    constructor (category_object, area_name) {
        this.category = category_object.id;
        this.categoryObject = category_object;
        this.area = area_name;
        this.alerts = [];
        this.element = null;
    }

    async init () {
        const area = $("<div>");
        area.attr('class', 'area');
        $("#realTime").children("#category"+this.category).children(".alerts").append(area);
        this.element = area;

        const header = $("<div>");
        header.attr('class', 'area_header')
        area.append(header);
        const title = $("<h1>");
        title.text(this.area);
        const bg = $("<div>");
        bg.attr('class', 'bg');
        header.append(title, bg);

        const alerts = $("<div>");
        alerts.attr('class', 'area_alerts');
        area.append(alerts);

        // anims
        title.hide()
        bg.css('width', '0');
        slideRight(bg, 300);
        title.fadeIn(300);
    }

    async add (city_name) {
        this.alerts.push(city_name);
        
        const city = $("<div>");
        city.attr('class', 'city');
        city.attr('id', city_name.replaceAll(' ', '_'));
        this.element.children(".area_alerts").append(city);

        const title = $("<div>");
        title.attr('class', 'city_name')
        title.text(city_name);
        const bg = $("<div>");
        bg.attr('class', 'bg');
        city.append(title, bg);

        // anims
        title.hide();
        bg.css('width', '0');
        slideRight(bg, 300);
        title.fadeIn(300);
    }

    async checkAlerts () {
        if (this.alerts.length == 0) {
            this.deleteThis();
            this.categoryObject.checkAreas();
        }
    }

    async remove (city_name) {
        this.alerts.splice(this.alerts.indexOf(city_name.replaceAll(' ', '_')), 1);

        const city_element = this.element.children('.area_alerts').children('#' + city_name.replaceAll(' ', '_'));
        slideRightClose(city_element.children('.bg'), 300);
        city_element.children('.city_name').fadeOut(300);
        await wait(300);
        city_element.remove();
        this.checkAlerts();
    }

    async deleteThis () {
        delete this.categoryObject.areas[this.area];
        
        slideRightClose(this.element.children(".area_header").children(".bg"), 300);
        this.element.children(".area_header").children("h1").fadeOut(300);
        await wait(300);
        this.element.remove();
    }
}

class Category {
    constructor (mainalert, cat_id) {
        
        const desc = {
            1: 'ירי רקטות וטילים',
            2: 'חדירת כלי טיס עוין',
            3: 'חשש לחדירת מחבלים',
        };
        const id_logo = {
            1: '../assets/cat1.png',
            2: '../assets/cat2.png',
            3: '../assets/cat3.png',
        };
        this.id = cat_id;
        this.desc = desc[cat_id];
        this.logo = id_logo[cat_id];
        this.areas = {};
        this.element = null;
        this.mainalert = mainalert;
    }

    async init () {
        const cat = $("<div>");
        cat.attr('class', 'category');
        cat.attr('id', "category"+this.id);
        $("#realTime").append(cat);
        this.element = cat;

        const header = $("<div>");
        header.attr('class', 'header')
        const alerts = $("<div>");
        alerts.attr('class', 'alerts')
        cat.append(header, alerts);
    
        const bg = $("<div>");
        bg.attr('class', 'bg')
        const header_text = $("<div>");
        header_text.attr('class', 'text');
        header_text.text(this.desc);
        const header_icon = $("<img>");
        header_icon.attr('src', this.logo);
        header.append(bg, header_text, header_icon);
        
        bg.css('width', '0');
        slideRight(bg, 300);
        header_text.hide();
        header_icon.hide();
        header_text.fadeIn(200);
        await wait(200);
        header_icon.fadeIn(100);
    }

    findArea (area_name) {
        if (this.areas[area_name]) {
            return true;
        }
        return false;
    }

    checkAreas () {
        if (Object.keys(this.areas).length == 0) {
            this.deleteThis();
            this.mainalert.checkCategory();
        }
    }

    addArea (area_name) {
        const area = new Area(this, area_name);
        area.init();
        this.areas[area_name] = area;
        return area;
    }

    removeArea (area_name) {
        this.areas[area_name].deleteThis();
        this.areas[area_name].remove();
        this.checkAreas()
    }

    async deleteThis () {
        delete this.mainalert.categories[this.id];
        // console.log(this.mainalert.categories)
        
        slideRightClose(this.element.children(".header").children(".bg"), 300);
        this.element.children(".header").children(".text").fadeOut(300);
        this.element.children(".header").children(".image").fadeOut(300);
        
        await wait(300);
        this.element.remove();
    }
}

export class MainAlert {
    constructor () {
        this.categories = {};
        this.initialized = false;
    }
    
    async init () {
        this.initialized = true;
        const alert = $("<div>");
        alert.attr('id', 'realTime');
        $("body").append(alert);
        
        const header = $("<div>");
        header.attr('id', 'header');
        
        const bg = $("<div>")
        bg.attr('id', 'bg')
        
        const logo = $("<img>");
        logo.attr('src', '../assets/logo.png');
        
        const title = $("<h1>");
        title.text("התראות פיקוד האורן");
        
        $("#realTime").append(header);
        header.append(bg, logo, title);

        // anims
        logo.hide();
        title.hide();
        bg.css('width', 0);
        logo.fadeIn(200);
        await wait(200);
        slideRight(bg, 300);
        title.fadeIn(400);
    }

    async checkCategory () {
        // console.log(this.categories)
        if (this.initialized == true && Object.keys(this.categories).length == 0) {
            this.initialized = false;
            this.deleteThis();
        }
    }

    findCategory (cat_id) {
        // try {
        //     this.categories[cat_id]
        // }
        // catch {
        //     console.log("catched")
        //     return false;
        // }
        // return true;
        if (this.categories[cat_id]) {
            return true;
        }
        return false;
    }
    
    addCategory (cat_id) {
        const category = new Category(this, cat_id);
        category.init();
        this.categories[cat_id] = category;
        return category;
    }

    async deleteCategory (cat_id) {
        this.categories[cat_id].remove();
        this.checkCategory();
    }

    async deleteThis() {
        this.initialized = false;
        $("#realTime").children("#header").children("h1").fadeOut(300);
        slideRightClose($("#realTime").children("#header").children("#bg"), 400);
        await wait(400);
        $("#realTime").children("#header").children("img").fadeOut(200);
        await wait(200);
        $("#realTime").remove();
    }

    async addAlert(cat_id, area_name, city_name) {
        if (this.findCategory(cat_id)) {
            const category = this.categories[cat_id];
            if (category.findArea(area_name) == true) {
                const area = category.areas[area_name];
                area.add(city_name);
            }
            else {
                const area = category.addArea(area_name);
                area.add(city_name);
            }
        }
        else {
            const category = this.addCategory(cat_id);
            const area = category.addArea(area_name);
            area.add(city_name);
        }
    }

    async removeAlert(cat_id, area_name, city_name) {
        const category = this.categories[cat_id];
        const area = category.areas[area_name];
        area.remove(city_name);
    }
}