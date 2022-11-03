import { PolymerElement } from "@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";

import { clDefaultTemplate } from "cl-polymer-element-helpers/cl-default-template.js";
import { clDefaultStyle } from "cl-polymer-element-helpers/cl-default-style.js";

import { __decorate, query, symbolIterator } from "cl-polymer-element-helpers/cl-helpers.js";
import { property, observe, computed, customElement } from "@polymer/decorators";

import { clKeyboardAccessibilityHelper } from "cl-polymer-element-helpers/cl-keyboard-accessibility-helper.js";

import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-tooltip/paper-tooltip.js";

import "cl-polymer-element-helpers/ct-element-style.js";

const lCa = function(a) {
    a = Object.assign({}, a);
    let b = symbolIterator(Object.keys(a));
    for (let c = b.next(); !c.done; c = b.next())
        c = c.value,
        void 0 === a[c] && delete a[c];
    return a
};

const gt = function( item ) {
    return "SEPARATOR" !== item.role && "GROUP_NAME" !== item.role
};

let gDd = {
    dynamicAlign: true,
    horizontalAlign: "left",
    verticalAlign: "top",
    verticalOffset: 0,
    horizontalOffset: 0
};

let ctPolymerSimpleTextMenuTemplate;
let ctPolymerSimpleTextMenuTemplateDefault;
let ctPolymerSimpleTextMenuBase = mixinBehaviors([], PolymerElement);
class ctPolymerSimpleTextMenu extends ctPolymerSimpleTextMenuBase {  
    constructor () {
        super();
        this.paperDialogPassThrough = {};
        this.autofocusList = false;
        this.shouldAutofocusList = false;
    }  

    ready () {
        super.ready();
        this.overrideFit( this.dialog )
    }
    
    connectedCallback () {
        super.connectedCallback();
        document.addEventListener("iron-overlay-canceled", this.onEscOrClickingOutside.bind(this));
    }

    disconnectedCallback () {
        super.disconnectedCallback();
        document.removeEventListener("iron-overlay-canceled", this.onEscOrClickingOutside.bind(this));
    }

    overrideFit ( element ) {
        let elementFitSuper = element.fit.bind(element)
          , base = this;
        element.fit = function() {
            elementFitSuper();
            let config;
            (null == (config = base.config) ? 0 : config.menuMaxWidthOverride) ? element.sizingTarget.style.maxWidth = String(base.config.menuMaxWidthOverride) + "px" : element.sizingTarget.style.maxWidth = "initial"
        }
    }
    
    onConfigChange () {
        if (this.paperDialogPassThrough && this.config) {
            let config = this.config;
            config.compact && this.setAttribute("compact", "");
            config.menuMinWidthOverride && (this.dialog.style.minWidth = String(config.menuMinWidthOverride) + "px");
            config.boxShadowStyleOverride && (this.dialog.style.boxShadow = config.boxShadowStyleOverride);
            config.borderRadiusStyleOverride && this.updateStyles({
                "--ct-standard-border-radius": config.borderRadiusStyleOverride
            });
            this.updateStyles({
                "--ct-polymer-simple-text-menu-margin": config.menuMarginStyleOverride || ""
            });
            this.isOpened() && this.dialog.notifyResize()
        }
    }
    
    setConfig( config, paperDialogPassThrough ) {
        this.config = config;
        this.paperDialogPassThrough = paperDialogPassThrough;
    }
    
    open() {
        let a = this.config && void 0 !== this.config.selectedValue;
        this.shouldAutofocusList = this.autofocusList || a || this.keyboardNavigation.isEnabled();
        this.dialog.open()
    }
    
    isOpened() {
        return this.dialog.opened
    }
    
    onSelect(a) {
        if (this.config)
            if (this.footer && a.detail.item === this.footer)
                this.fire("ct-polymer-simple-text-menu-footer-selected");
            else {
                var b = this.config.items.find(function(c) {
                    return c.value === a.detail.selected
                });
                b.disabled || (this.dialog.close(),
                this.hasAnchor(b) && this.keyboardNavigation.isEnabled() && this.followLink(b.anchorUrl, b.anchorTarget),
                this.fire("ct-polymer-simple-text-menu-selected", a.detail.selected))
            }
    }
    
    onEscOrClickingOutside() {
        this.closeMenu()
    }
    
    closeMenu() {
        this.dialog.close();
        this.fire("ct-polymer-simple-text-menu-cancelled")
    }
    
    focusList() {
        this.listbox.focus()
    }
    
    hasAnchor(a) {
        return !gt(a) || a.disabled ? false : !!a.anchorUrl
    }
    
    isRegularItem(a) {
        return gt(a) && !this.hasAnchor(a)
    }
    
    isMenuGroup(a) {
        return "GROUP_NAME" === a.role
    }
    
    getIconName( icon ) {
        return !this.isImageIcon(icon) && icon || "non-existent-blank-icon"
    }
    
    isImageIcon(a) {
        return !!a && void 0 !== a.url
    }
    
    maybeSecondIconClass(a) {
        return gt(a) && a.icon && a.rightIcon && !this.isImageIcon(a.rightIcon) ? "second-icon" : ""
    }
    
    itemHasTooltip(a) {
        return gt(a) ? !!a.tooltip : false
    }
    
    getItemClass(a) {
        let b = [];
        gt(a) && a.tooltip && a.disabled && b.push("override-pointer-events");
        gt(a) && a.badge && ("end" === a.badgePosition ? b.push("has-end-badge") : b.push("has-bottom-badge"));
        return b.join(" ")
    }
    
    getTextContentClass( item ) {
        return gt(item) && item.badge ? "end" === item.badgePosition ? "row" : "" : ""
    }
    
    createMenuText( string ) {
        return "string" === typeof string ? string : ""
    }
    
    getItemRole ( item ) {
        return "SEPARATOR" === item.role ? "separator" : "GROUP_NAME" === item.role ? "group" : this.config && "listbox" === this.config.role ? "option" : "menuitem"
    }
    
    followLink( url, target ) {
        target ? window.open(url, target) : window.location.href = url;
    }

    get mergedPaperDialogPassThrough () {
        let a = gDd;
        this.paperDialogPassThrough && (a = Object.assign({}, gDd, lCa(this.paperDialogPassThrough)));
        this.positionTarget && (a.positionTarget = this.positionTarget);
        return a
    }

    static get template() {
        if (void 0 === ctPolymerSimpleTextMenuTemplate || null === ctPolymerSimpleTextMenuTemplate) {
            let template = document.createElement("template");
            template.innerHTML = `
            <style>
                :host {
                    --ct-polymer-simple-text-menu-item-height: 32px;
                    --ct-polymer-simple-text-menu-item-padding: 0 24px;
                    --ct-polymer-simple-text-menu-vertical-padding: 8px;
                    --ct-polymer-simple-text-menu-right-url-icon-max-width: 32px;
                    --paper-item-focused-background-color: var(--ct-selected-item);
                    --ct-font-subheading-baseline-bottom: 7px;
                } 

                :host([compact]) {
                    --ct-polymer-simple-text-menu-item-height: 24px;
                } 

                paper-dialog {
                    margin: var(--ct-polymer-simple-text-menu-margin,0 0 0 0);
                    padding: 0;
                    overflow-y: auto;
                    min-width: 128px;
                    min-height: calc(var(--ct-polymer-simple-text-menu-vertical-padding) + var(--ct-polymer-simple-text-menu-item-height));
                    border-radius: var(--ct-standard-border-radius);
                    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14),0 1px 5px 0 rgba(0,0,0,0.12),0 3px 1px -2px rgba(0,0,0,0.2);
                } 

                #paper-list {
                    margin: 0;
                    padding: var(--ct-polymer-simple-text-menu-vertical-padding) 0;
                    background-color: var(--ct-menu-background);
                } 

                :host([compact]) #paper-list {
                    padding: 4px 0;
                } 

                .override-pointer-events {
                    pointer-events: auto !important;
                } 

                #header-text {
                    max-width: 200px;
                    margin: 12px 12px 4px;
                    padding: 0 12px;
                    background-color: var(--ct-spec-general-background);
                    border-radius: 4px;
                    color: var(--ct-secondary-text-color);
                    font-family: var(--ct-primary-font-family);
                    font-weight: 500;
                    -webkit-font-smoothing: var(--ct-primary-font-smoothing);
                    font-size: 13px;
                    line-height: 20px;
                    padding-top: 12px;
                    padding-bottom: 12px;
                } 

                #footer {
                    cursor: var(--ct-polymer-simple-text-menu-footer-cursor, pointer);
                    min-height: 0;
                } 

                paper-item.paper-item {
                    background-color: inherit;
                    cursor: pointer;
                    padding: var(--ct-polymer-simple-text-menu-item-padding);
                    min-height: var(--ct-polymer-simple-text-menu-item-height);
                    overflow-y: hidden;
                    flex: 1;
                    width: auto;
                    display: flex;
                    white-space: normal;
                    --paper-item-focused-before-opacity: 0;
                } 

                paper-item > * {
                    flex: 1;
                    display: flex;
                } 

                .right-container {
                    display: flex;
                    flex: 1;
                    justify-content: space-between;
                } 

                .menu-icon,
                .menu-right-icon {
                    color: var(--ct-polymer-simple-text-menu-icon-color, var(--ct-secondary-text-color));
                    height: 24px;
                    width: 24px;
                    flex: none;
                } 

                .menu-icon {
                    margin: 4px 16px 4px 0;
                } 

                .menu-right-icon {
                    margin: 4px 4px 4px 0;
                    padding-left: 16px;
                } 

                .menu-right-icon.url-icon {
                    display: flex;
                    flex: 1;
                    justify-content: flex-end;
                    max-width: var(--ct-polymer-simple-text-menu-right-url-icon-max-width);
                    width: auto;
                } 

                .url-icon img {
                    height: 100%;
                    max-width: 100%;
                    object-fit: contain;
                } 

                .menu-right-icon.second-icon {
                    height: 16px;
                    padding-bottom: 5px;
                    padding-top: 3px;
                    width: 16px;
                } 

                .text-content {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                } 

                .text-content.row {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                } 

                paper-item.paper-item {
                    font-family: var(--ct-primary-font-family);
                    font-weight: 400;
                    -webkit-font-smoothing: var(--ct-primary-font-smoothing);
                    font-size: 15px;
                    line-height: 24px;
                    --paper-item-selected-weight: normal;
                } 

                #formatted-string {
                    padding-top: 3px;
                    padding-bottom: calc(12px - var(--ct-font-subheading-baseline-bottom));
                    color: var(--ct-primary-text-color);
                } 

                .has-bottom-badge #formatted-string {
                    padding-bottom: calc(8px - var(--ct-font-subheading-baseline-bottom));
                } 

                .has-bottom-badge .badge {
                    margin-bottom: 4px;
                } 

                .has-end-badge .badge {
                    margin-left: 8px;
                } 

                paper-item:hover {
                    background-color: var(--ct-hover-item);
                } 

                paper-item[disabled] {
                    background-color: inherit;
                    cursor: default;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                } 

                paper-item[disabled]:hover {
                    background-color: inherit;
                } 

                paper-item[disabled] #formatted-string,
                paper-item[disabled] iron-icon {
                    color: var(--ct-text-disabled);
                } 

                paper-item[strikethrough] #formatted-string {
                    text-decoration: line-through;
                } 

                #footer:hover {
                    background-color: var(--ct-polymer-simple-text-menu-footer-hovered-color,var(--ct-hover-item));
                } 

                #footer:focus {
                    background-color: var(--ct-polymer-simple-text-menu-footer-focused-color,var(--ct-selected-item));
                } 

                :host([compact]) .menu-icon,
                :host([compact]) .menu-right-icon {
                    height: 20px;
                    width: 20px;
                } 

                :host([compact]) .menu-icon {
                    margin: 2px 16px 2px 0;
                } 

                :host([compact]) .menu-right-icon {
                    margin: 2px 0 2px auto;
                } 

                :host([compact]) .menu-right-icon.second-icon {
                    height: 16px;
                    padding-bottom: 2px;
                    padding-top: 2px;
                    width: 16px;
                } 

                :host([compact]) paper-item.paper-item {
                    font-family: var(--ct-primary-font-family);
                    font-weight: 400;
                    -webkit-font-smoothing: var(--ct-primary-font-smoothing);
                    font-size: 13px;
                    line-height: 20px;
                } 

                :host([compact]) #formatted-string {
                    padding-top: 2px;
                    padding-bottom: 2px;
                } 

                :host([compact]) .has-bottom-badge .badge {
                    margin: 0;
                } 

                paper-item[has-anchor] {
                    padding: 0;
                } 

                paper-item[has-anchor] a {
                    padding: var(--ct-polymer-simple-text-menu-item-padding);
                    display: flex;
                    flex: 1;
                } 

                a:focus {
                    outline: none;
                } 

                paper-item[role=separator] {
                    min-height: 0px;
                    background-color: var(--ct-line-divider);
                    height: 1px;
                    margin: 3px 0 4px;
                    padding: 0;
                } 

                :host([compact]) [role=separator] {
                    height: 1px;
                    margin: 1px 0 2px;
                } 

                paper-item[role=group] {
                    font-family: var(--ct-primary-font-family);
                    font-weight: 400;
                    -webkit-font-smoothing: var(--ct-primary-font-smoothing);
                    letter-spacing: 0.011em;
                    font-size: 12px;
                    line-height: 16px;
                    padding: 4px 24px 0 16px;
                } 

                :host([compact]) [role=group] {
                    font-family: var(--ct-primary-font-family);
                    font-weight: 400;
                    -webkit-font-smoothing: var(--ct-primary-font-smoothing);
                    letter-spacing: 0.011em;
                    font-size: 12px;
                    line-height: 16px;
                }
            </style>
            <paper-dialog id="dialog" dynamic-align="[[mergedPaperDialogPassThrough.dynamicAlign]]" horizontal-align="[[mergedPaperDialogPassThrough.horizontalAlign]]" horizontal-offset="[[mergedPaperDialogPassThrough.horizontalOffset]]" no-auto-focus="[[mergedPaperDialogPassThrough.noAutoFocus]]" no-cancel-on-outside-click="[[mergedPaperDialogPassThrough.noCancelOnOutsideClick]]" no-overlap="[[mergedPaperDialogPassThrough.noOverlap]]" position-target="[[mergedPaperDialogPassThrough.positionTarget]]" restore-focus-on-close="[[mergedPaperDialogPassThrough.restoreFocusOnClose]]" vertical-align="[[mergedPaperDialogPassThrough.verticalAlign]]" vertical-offset="[[mergedPaperDialogPassThrough.verticalOffset]]" >
                <div id="header-text" hidden$="[[!config.headerText]]" >[[config.headerText]]</div>
                <paper-listbox id="paper-list" attr-for-selected="value" autofocus$="[[shouldAutofocusList]]" role$="[[config.role]]" selected="[[config.selectedValue]]" on-iron-activate="onSelect" >
                    <template is="dom-repeat" items="[[config.items]]" as="item" initial-count="[[config.initialCount]]" >
                        <paper-item class$="paper-item [[getItemClass(item)]]" disabled$="[[item.disabled]]" has-anchor$="[[hasAnchor(item)]]" id$="text-item-[[index]]" role$="[[getItemRole(item)]]" strikethrough$="[[item.strikethrough]]" test-id$="[[item.value]]" value="[[item.value]]" >
                                
                            <template is="dom-if" if="[[hasAnchor(item)]]" >
                                <a class="remove-default-style" href$="[[item.anchorUrl]]" tabindex="-1" target$="[[item.anchorTarget]]">
                                    <template is="dom-if" if="[[config.showIcons]]" >
                                        <iron-icon class="menu-icon " icon="[[getIconName(item.icon)]]"></iron-icon>
                                    </template>
                                    <div class="right-container">
                                        <div class$="text-content [[getTextContentClass(item)]]" >
                                            <div id="formatted-string">[[createMenuText(item.text)]]</div>
                                            <template is="dom-if" if="[[item.badge]]" >
                                                <ct-badge class="badge " label="[[item.badge]]" state="[[item.badgeState]]"></ct-badge>
                                            </template>
                                        </div>
                                        <template is="dom-if" if="[[item.rightIcon]]">
                                            <template is="dom-if" if="[[isImageIcon(item.rightIcon)]]" >
                                                <div class="menu-right-icon url-icon ">
                                                    <img src$="[[item.rightIcon.url]]" alt$="[[item.rightIcon.altText]]" >
                                                </div>
                                            </template>
                                            <template is="dom-if" if="[[!isImageIcon(item.rightIcon)]]">
                                                <iron-icon class$="menu-right-icon [[maybeSecondIconClass(item)]] " icon="[[getIconName(item.rightIcon)]]" ></iron-icon>
                                            </template>
                                        </template>
                                    </div>
                                </a>
                            </template>
                            <template is="dom-if" if="[[isRegularItem(item)]]">
                                <template is="dom-if" if="[[config.showIcons]]" >
                                    <iron-icon class="menu-icon" icon="[[getIconName(item.icon)]]"></iron-icon>
                                </template>
                                <div class="right-container">
                                    <div class$="text-content [[getTextContentClass(item)]]">
                                        <div id="formatted-string">[[createMenuText(item.text)]]</div>
                                        <template is="dom-if" if="[[item.badge]]" >
                                            <ct-badge class="badge" label="[[item.badge]]" state="[[item.badgeState]]"></ct-badge>
                                        </template>
                                    </div>
                                    <template is="dom-if" if="[[item.rightIcon]]" >
                                        <template is="dom-if" if="[[isImageIcon(item.rightIcon)]]" >
                                            <div class="menu-right-icon url-icon ">
                                                <img src$="[[item.rightIcon.url]]" alt$="[[item.rightIcon.altText]]">
                                            </div>
                                        </template>
                                        <template is="dom-if" if="[[!isImageIcon(item.rightIcon)]]">
                                            <iron-icon class$="menu-right-icon [[maybeSecondIconClass(item)]] " icon="[[getIconName(item.rightIcon)]]"></iron-icon>
                                        </template>
                                    </template>
                                </div>
                            </template>
                            <template is="dom-if" if="[[isMenuGroup(item)]]" >
                                <div>[[item.text]]</div>
                            </template>
                        </paper-item>
                        <template is="dom-if" restamp="" if="[[itemHasTooltip(item)]]">
                        <paper-tooltip for$="text-item-[[index]]" label="[[item.tooltip]]" offset="6" position="[[item.tooltipPosition]]"></paper-tooltip>
                    </template>
                </template>
                <template is="dom-if" restamp="" if="[[config.showFooter]]" >
                    <paper-item id="footer" class="paper-item">
                        <slot name="footer"></slot>
                    </paper-item>
                </template>
                </paper-listbox>
            </paper-dialog>

            `;
            template.content.insertBefore(clDefaultStyle().content.cloneNode(true), template.content.firstChild);
            let templateContent = template.content;
            let templateInsertBefore = templateContent.insertBefore;
            let defaultTemplate;
            if (void 0 === ctPolymerSimpleTextMenuTemplateDefault || null === ctPolymerSimpleTextMenuTemplateDefault) {
                defaultTemplate = clDefaultTemplate();
                ctPolymerSimpleTextMenuTemplateDefault = defaultTemplate
            }
            defaultTemplate = ctPolymerSimpleTextMenuTemplateDefault;
            templateInsertBefore.call(templateContent, defaultTemplate.content.cloneNode(true), template.content.firstChild);

            return ctPolymerSimpleTextMenuTemplate = template;
        }

        return ctPolymerSimpleTextMenuTemplate;
    }
}

__decorate(
    [
        property({ type: Object }),
        query("paper-dialog")
    ], 
    ctPolymerSimpleTextMenu.prototype, 
    "dialog", 
    void 0
);

__decorate(
    [
        property({ type: Object }),
        query("paper-listbox")
    ], 
    ctPolymerSimpleTextMenu.prototype, 
    "listbox", 
    void 0
);

__decorate(
    [
        property({ type: Object }),
        query("#footer")
    ], 
    ctPolymerSimpleTextMenu.prototype, 
    "footer", 
    void 0
);


__decorate(
    [
        property({ type: Boolean })
    ], 
    ctPolymerSimpleTextMenu.prototype, 
    "autofocusList", 
    void 0
);

__decorate(
    [
        property({ type: HTMLElement })
    ], 
    ctPolymerSimpleTextMenu.prototype, 
    "positionTarget", 
    void 0
);

__decorate(
    [
        property({ type: Object })
    ], 
    ctPolymerSimpleTextMenu.prototype, 
    "config", 
    void 0
);

__decorate(
    [
        property({ type: Object })
    ], 
    ctPolymerSimpleTextMenu.prototype, 
    "paperDialogPassThrough", 
    void 0
);

__decorate(
    [
        property({ type: Object }),
        computed("paperDialogPassThrough", "positionTarget")
    ], 
    ctPolymerSimpleTextMenu.prototype, 
    "mergedPaperDialogPassThrough", 
    null
);

__decorate(
    [
        property({ type: Function }),
        observe("paperDialogPassThrough", "config")
    ], 
    ctPolymerSimpleTextMenu.prototype, 
    "onConfigChange", 
    null
);

__decorate(
    [
        property({ type: clKeyboardAccessibilityHelper })
    ], 
    ctPolymerSimpleTextMenu.prototype, 
    "keyboardNavigation", 
    void 0
);

ctPolymerSimpleTextMenu = __decorate([
    customElement("ct-polymer-simple-text-menu")
], ctPolymerSimpleTextMenu);

export { ctPolymerSimpleTextMenu };