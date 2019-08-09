document.addEventListener('DOMContentLoaded', function(){
    var form = document.querySelector('form.form');
    var textarea = form.querySelector('textarea');
    var selects = form.querySelectorAll('select');
    
    var submitBtn = form.querySelector('p.submit');
    var recaptcha = document.querySelector('.g-recaptcha');
    var lockedElements = [submitBtn, recaptcha];

    var formControls = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], select, textarea');

    var checkboxesConatiner = form.querySelector('.pd-checkbox .value');
    var checkboxes = checkboxesConatiner.querySelectorAll('span');
    var checkboxGroupLabel = form.querySelector('.pd-checkbox .field-label');
    
    var headings = form.querySelectorAll('.form-title');
    var headingSlots = form.querySelectorAll('.heading-before');


    function classMods(){
        //big old add class

        if(!formControls.length) return;

        formControls.forEach(function(formControl){
            formControl.classList.add('form-control');
        });


        if(!lockedElements.length) return;

        lockedElements.forEach(function(element){
            element.classList.add('col-xs-12');
        });
    }

    function checkboxWrap(){
        //wrap them checkboxes
        if(!checkboxes.length) return;

        checkboxGroupLabel.classList.add('group-label', 'col-xs-12');
        checkboxesConatiner.classList.add('d-block', 'col-xs-12', 'px-30');

        checkboxes.forEach(function(checkbox, index){
            var bootstrapDiv = document.createElement("div");

            bootstrapDiv.className = 'col-xs-12 col-md-4';
            
            checkboxesConatiner.appendChild(bootstrapDiv);
            bootstrapDiv.appendChild(checkbox);

            var label = checkbox.querySelector('label');
            var actualCheckbox = checkbox.querySelector('input[type="checkbox"]');
            label.classList.add('checkbox');
            label.prepend(actualCheckbox);
        });
    }

    
    function conditionalCheckboxes(){
        
        /*maps a group of checkboxes to a hidden dropdown because Pardot is Pardot. 
        only a dropdown can control show/hide conditional logic... sigh*/

        //name attributes of the power-related checkboxes
        var powerGroup = [
            '484581_50245pi_484581_50245_518127',
            '484581_50245pi_484581_50245_518131',
            '484581_50245pi_484581_50245_518133',
            '484581_50245pi_484581_50245_518135',
            '484581_50245pi_484581_50245_518137'
        ];

        //name attributes of the gas-related checkboxes
        var gasGroup = [
            '484581_50245pi_484581_50245_518129',
        ];

        var depField = form.querySelector('.Dependent_Field_Controller select');
        
        //possible values the hidden select field
        var noneValue = '521473';
        var gasValue = '521475';
        var powerValue = '521477';
        var bothValue = '521479';

        var powerIsSelected = powerGroup.some(isChecked);
        var gasIsSelected = gasGroup.some(isChecked);

        if(gasIsSelected && powerIsSelected){
            depField.value = bothValue;
        } 

        if(!gasIsSelected && !powerIsSelected){
            depField.value = noneValue;
        } 

        if(gasIsSelected && !powerIsSelected){
            depField.value = gasValue;
        } 

        if(!gasIsSelected && powerIsSelected){
            depField.value = powerValue;
        }

        if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            depField.dispatchEvent(evt);
        }
    }

    function isChecked(name){
        var checkbox = form.querySelector('[name="'+name+'"]');

        return checkbox.checked;
    }
    
    function setTextareaRows(){
        //set the height of the textarea field
        if(typeof textarea !== "undefined" && textarea !== null){
            textarea.setAttribute('rows' , 5);
        }
    }

    function selectPlaceholders(){
        if(!selects.length) return;

        selects.forEach(function(select){
            if (select.tagName == 'SELECT') {
                select.options[0].text = select.options[1].text;
                select.options[1].setAttribute('disabled', '');
                select.options[1].setAttribute('selected', '');
                select.remove(select.options[0]);
            } 
        });
    }

    function handleErrors(){
        var errors = form.querySelectorAll('.error.no-label');
        var errorFields = form.querySelectorAll('.form-field.error');
        
        if(errors.length){
            errors.forEach( function(error, index){
                let this_field = errorFields[index];
                let input = this_field.querySelector('input[type="text"], input[type="email"], input[type="tel"], select, textarea');

                if(typeof input !== undefined && input !== null){
                    input.classList.add('parsley-error');
                }
                
                this_field.setAttribute('data-err-msg', error.textContent + '  \u00D7');
            });
        } 
    }
    
    function injectHeadings(){
        //move headings into place
        if(!headings.length) return;

        headings.forEach(function(heading, index){
            var lineOrNot = index == 0 ? '' : 'has-separator'; 
            
            if(lineOrNot){
                heading.classList.add(lineOrNot);
            }

            heading.classList.add('col-xs-12');
        
            headingSlots[index].insertAdjacentElement('beforebegin' , heading);
        });
    }

    function setEventBindings(){
        checkboxesConatiner.addEventListener('change', conditionalCheckboxes.bind(this));
    }

    function shouldInit(){
        if(typeof form !== 'undefined' && form !== null){
            return true;
        }
    }

    function init(){
        if(!shouldInit()) return;

        setEventBindings();
        classMods();
        checkboxWrap();
        setTextareaRows();
        selectPlaceholders();
        handleErrors();
        injectHeadings();
    }

    init();

});

//nodelist foreach polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
(function (arr) {
    arr.forEach(function (item) {
      if (item.hasOwnProperty('prepend')) {
        return;
      }
      Object.defineProperty(item, 'prepend', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function prepend() {
          var argArr = Array.prototype.slice.call(arguments),
            docFrag = document.createDocumentFragment();
          
          argArr.forEach(function (argItem) {
            var isNode = argItem instanceof Node;
            docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
          });
          
          this.insertBefore(docFrag, this.firstChild);
        }
      });
    });
  })([Element.prototype, Document.prototype, DocumentFragment.prototype]);