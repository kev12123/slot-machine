/**
* Slot machine
* Author: Saurabh Odhyan | http://odhyan.com
*
* Licensed under the Creative Commons Attribution-ShareAlike License, Version 3.0 (the "License")
* You may obtain a copy of the License at
* http://creativecommons.org/licenses/by-sa/3.0/
*
* Date: May 23, 2011 
*/
$(document).ready(function() {
    /**
    * Global variables
    */
    var counter;
   
    var completed = 0,
        imgHeight = 6000,
        posArr = [
            0, //product 1
            500,//2
            1000,//3
            1500,//1
            2000,//2
            2500,//3
            3000,//1
            3500,//2
            4000,//3
            4500,//1
            


           
           
        ];
    
    var win = [];
    win[0] = win[1507] = win[3006] = 1;
     win[510] = win[2003] = win[3500] = 2;
      win[1015] = win[2498] = win[4015] = 3;
       
  

    /**
    * @class Slot
    * @constructor
    */
    function Slot(el, max, step) {
        this.speed = 0; //speed of the slot at any point of time
        this.step = step; //speed will increase at this rate
        this.si = null; //holds setInterval object for the given slot
        this.el = el; //dom element of the slot
        this.maxSpeed = max; //max speed this slot can have
        this.pos = posArr[500]; //final position of the slot    

        $(el).pan({
            fps:30,
            dir:'down'
        });
        $(el).spStop();
    }

    /**
    * @method start
    * Starts a slot
    */
    Slot.prototype.start = function() {
        var _this = this;
        $(_this.el).addClass('motion');
        $(_this.el).spStart();
        _this.si = window.setInterval(function() {
            if(_this.speed < _this.maxSpeed) {
                _this.speed += _this.step;
                $(_this.el).spSpeed(_this.speed);
            }
        }, 100);
    };

    /**
    * @method stop
    * Stops a slot
    */
    Slot.prototype.stop = function() {
        counter++;
        var _this = this,
            limit = 30;
        clearInterval(_this.si);
        _this.si = window.setInterval(function() {
            if(_this.speed > limit) {
                _this.speed -= _this.step;
                $(_this.el).spSpeed(_this.speed);
            }
            if(_this.speed <= limit) {
                _this.finalPos(_this.el);
                $(_this.el).spSpeed(0);
                $(_this.el).spStop();
                clearInterval(_this.si);
                $(_this.el).removeClass('motion');
                _this.speed = 0;
            }
        }, 100);
    };

    /**
    * @method finalPos
    * Finds the final position of the slot
    */
      Slot.prototype.finalPos = function() {
        var el = this.el,
            el_id,
            pos,
            posMin = 200000000000,
            best,
            bgPos,
            i,
            j,
            k;
            counter ++;


        el_id = $(el).attr('id');
        //pos = $(el).css('background-position'); //for some unknown reason, this does not work in IE
        pos = document.getElementById(el_id).style.backgroundPosition;
        pos = pos.split(' ')[1];
        pos = parseInt(pos, 10);

        for(i = 0; i < posArr.length; i++) {
            for(j = 0;;j++) {
                k = posArr[i] + (imgHeight * j);
                if(k > pos) {

                    if((k - pos) < posMin) {
                        posMin = k - pos;
                        best = k;
                        this.pos=$(this.el).css('background-position', '0px 1000px')// PRODUCT 1 ('0px 0px') , PRODUCT 2 ('0px 500px') ,PRODUCT 3('0px 1000px;)
                        

                    }
                    break;
                }
            }
        }

        best += imgHeight + 4;
        bgPos = "0 " + best + "px";
        $(el).animate({
            backgroundPosition:"(" + bgPos + ")"
        }, {
            duration: 2000,
            complete: function() {
                completed ++;
            }
        });
    };
    
    /**
    * @method reset
    * Reset a slot to initial state
    */
    Slot.prototype.reset = function() {
        var el_id = $(this.el).attr('id');
        $._spritely.instances[el_id].t = 0;
        $(this.el).css('background-position', '0px 4px');
        this.speed = 0;
        completed = 0;
        $('#result').html('');
    };

    function enableControl() {
        $('#control').attr("disabled", false);
    }

    function disableControl() {
        $('#control').attr("disabled", true);
    }

    function printResult() {
        var res;
        if(win[a.pos] === win[b.pos] && win[a.pos] === win[c.pos]) {
            res = "You Win!";
        } else {
            res = "You Lose";
        }
        $('#result').html(res);
    }

    //create slot objects
    var a = new Slot('#slot1', 130, 1),
        b = new Slot('#slot2', 150, 2),
        c = new Slot('#slot3', 160, 4);

    /**
    * Slot machine controller
    */
    $('#control').click(function() {
        var x;
        if(this.innerHTML == "Start") {
            a.start();
            b.start();
            c.start();
            this.innerHTML = "Stop";
            
            disableControl(); //disable control until the slots reach max speed
            
            //check every 100ms if slots have reached max speed 
            //if so, enable the control
            x = window.setInterval(function() {
                if(a.speed >= a.maxSpeed && b.speed >= b.maxSpeed && c.speed >= c.maxSpeed) {
                    enableControl();
                    window.clearInterval(x);
                }
            }, 100);
        } else if(this.innerHTML == "Stop") {
            a.stop();
            b.stop();
            c.stop();
            this.innerHTML = "Reset";

            disableControl(); //disable control until the slots stop
            
            //check every 100ms if slots have stopped
            //if so, enable the control
            x = window.setInterval(function() {
                if(a.speed === 0 && b.speed === 0 && c.speed === 0 && completed === 3) {
                    enableControl();
                    window.clearInterval(x);
                    printResult();
                }
            }, 100);
        } else { //reset
            a.reset();
            b.reset();
            c.reset();
            this.innerHTML = "Start";
        }
    });
});