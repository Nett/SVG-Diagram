(function($){
    var svgNS = 'http://www.w3.org/2000/svg';
    var xlinkNS="http://www.w3.org/1999/xlink";
    var settings;
    var startX, startY, finishX, finishY = 0;
    
    $.element = function(element, attributes, layer, text) {
        var svgElement = document.createElementNS(svgNS, element);
            $.each(attributes, function(attr, v) {
                var xParam = attr.indexOf(':');
                if(xParam != -1) {
                    svgElement.setAttributeNS(attr.substr(0, xParam), attr.substr(xParam+1, attr.length), v);
                }
                else {
                    svgElement.setAttributeNS(null, attr, v);
                }
            });
            
            if(element == 'text') {
                var textValue = document.createTextNode(text);
                svgElement.appendChild(textValue);
            }
            if(layer instanceof jQuery){
                layer = $(layer).get(0);
            }
            layer.appendChild(svgElement);
        return svgElement;
    }
    
    $.fn.getElementAttr = function (attr) {
        return $(this).attr(attr);
    }
    
    $.fn.setElementAttr = function (attr) {
        var element = $(this).get(0);
        $.each(attr, function(attr, v) {
            element.setAttributeNS(null, attr, v);
        });
        return element;
    }
    
    $.fn.setElementEvent = function(eventName, functionName, useCapture) {
        $(this).get(0).addEventListener(eventName, functionName, useCapture);
    }
    
    var methods = {
        init : function(svgContainer) {
            $(svgContainer).css({width: settings.cWidth, height: settings.cHeight});
            var svgRoot = $.element('svg', {'id': 'root', 'width': settings.cWidth+'px', 'height': settings.cHeight+'px'}, $(svgContainer).get(0));
            var defs = $.element('defs', {}, svgRoot);
            var canvasRoot = $.element('g', {'id': 'rootGroup', 'width': settings.cWidth+'px', 'height': settings.cHeight+'px'}, svgRoot);
            return {'root':svgRoot, 'defs':defs, 'rootGroup':canvasRoot};
        },
        drawAxes : function(rootGroup,defs) {
            startX = (settings.cWidth*10)/100;
            startY = settings.cHeight-((settings.cHeight*10)/100);
            finishX = settings.cWidth-startX;
            finishY = (settings.cHeight*10)/100;
            var arrowGroup = $.element('g', {'id': 'arrowEntyty'}, defs);
            var arrowMarker = $.element('marker' , {'id': 'arrow', 'markerWidth': '10', 'markerHeight': '4', 'refX': '0', 'refY': '2', 'orient': 'auto'}, arrowGroup);
            $.element('polygon', {'points': '0,0 7,2 0,4', 'fill': '#000'}, arrowMarker);
            $.element('rect', {'id': 'backGround', 'height': settings.cHeight+'px', 'width': settings.cWidth+'px', 'fill': '#fcfcfc'}, rootGroup);
            $.element('svg' , {'id': 'diagramRoot', 'x': startX, 'y': finishY, 'viewBox': 0+' '+0+' '+(finishX-startX)+' '+(startY-finishY), 'width': (finishX-startX)+'px', 'height': (startY-finishY)+'px'}, rootGroup);
            $.element('path', {'id': 'xAxe', 'd': 'M'+(startX)+','+startY+' L'+finishX+','+startY, 'stroke': '#000', 'stroke-width': '2px', 'marker-end': 'url(#arrow)'}, rootGroup);
            //$.element('animate', {'id': 'moveXAxe', 'attributeName': 'stroke-dashoffset', 'from': animateXAxe.getTotalLength().toString(), 'to': '0', 'dur': '2s', 'begin': '0s', 'fill': 'freeze', 'calcMode': 'paced'}, animateXAxe);
            //$.element('animateMotion', {'begin': '0s', 'dur': '2s', 'repeatDur': 'indefinite', 'path': $(animateXAxe).attr('d')}, arrowGroup);
            //$(animateXAxe).setElementAttr({'stroke-dasharray': animateXAxe.getTotalLength().toString()+","+animateXAxe.getTotalLength().toString(), 'stroke-dashoffset': animateXAxe.getTotalLength().toString()});  //, 'marker-end': 'url(#arrow)'
            //
            //var circle = $.element('circle', {'cx': '20', 'cy': '40', 'r': '10', 'fill': 'red'}, rootGroup);
            //var circleeA = $.element('animateMotion', {'begin': '1s', 'dur': '4s', 'repeatDur': 'indefinite'}, circle);
            //$.element('mpath', {'xlink:href': '#xAxe'}, circleeA);
            $.element('path', {'id': 'yAxe', 'd': 'M'+startX+','+startY+' L'+startX+','+finishY, 'stroke': '#000', 'stroke-width': '2px', 'marker-end': 'url(#arrow)'}, rootGroup);
            //alert( settings.xAxe.getTotalLength() );
        },
        
        drawSectors : function (rootGroup,defs) {
            var diagramRoot = $('#diagramRoot').get(0);
            $.element('rect', {'id': 'viewBoxBackGround', 'height': (startY-finishY)+'px', 'width': (finishX-startX)+'px', 'fill': '#fefefe'}, diagramRoot);
            var sectorRoot = $.element('g', {'id': 'rootGroup', 'width': (finishX-startX)+'px', 'height': (startY-finishY)+'px'}, diagramRoot);
            var stepX = ($('#xAxe').get(0).getTotalLength() / settings.data[0].length);
            var minYSector = (startY-finishY);
            $.each(settings.data[0], function(k, v) {
                var xPos = 0;
                if(k > 0) {
                    xPos = xPos+(k*stepX);
                    $.element('line', {'x1': xPos, 'y1': minYSector, 'x2': xPos, 'y2': 0, 'stroke': '#000', 'stroke-width': '0.1px', 'stroke-dasharray': '1,1'}, sectorRoot);
                }
                $.element('text', {'x': xPos+'px', 'y': (startY)+'px', 'id': 'text', 'fill': 'green', 'font-size': '12px', 'font-family': 'Verdana'}, rootGroup, v);
            });
            console.log(settings.data[0]);
            console.log(settings.data[0].length);
            //$('#yAxe').attr('stroke');
            //$.element('line', {'x1':-110, 'y1': 0, 'x2':1450, 'y2': 650, 'stroke': '#000', 'marker-end': 'url(#arrow)', 'stroke-width': '4px'}, $('#graphicRoot').get(0));
            
        },
        
        lineChart : function(rootGroup,defs) {
            methods.drawAxes(rootGroup, defs);
            methods.drawSectors(rootGroup, defs);
        }
        
    };
    $.fn.diagram = function(draw,options){
        settings = $.extend({
            cWidth: 400,
            cHeight: 200,
            data : new Array()
        },
        options || {}
    );
         if ( methods[draw] ) {
             var svgRoot = methods.init($(this));
             return methods[draw].apply( this, new Array(svgRoot.rootGroup, svgRoot.defs));
         } else if ( typeof options === 'object' || ! options ) {
            return methods.init.apply( this, $(this) );
         } else {
            $.error( 'Method ' +  options + ' does not exist on jQuery plugin.' );
         }
        
        //var svgRootGroupElements = methods.init($(this));
        //methods.drawAxes(svgRootGroupElements.rootGroup, svgRootGroupElements.defs);
        //$(this).addClass('c-container').append(document.createElementNS(svgNS, 'svg'));
        //methods.drawAxes($(this));
    }
})(jQuery)

function test() {
    alert('Ok test');
}