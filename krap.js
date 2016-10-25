
var krapAttr = {
    width: 'width',
    height: 'height',
    id: 'id',
    class: 'class',
    undefined: 'undefined'
};
var errorMessages = {
    inf: 'id is not found',
    stw: 'How did it come here. Some thing went seriously wrong.',
    cou: 'Create object first and use it'
};
var fnSvgElement = {
    newElement: 'undefined',
    createNewElement: function (element) {
        this.newElement = document.createElementNS("http://www.w3.org/2000/svg", element);
        return this;
    },
    addAttribute: function (key, value) {
        if (this.newElement !== 'undefined')
            this.newElement.setAttribute(key, value);
        else {
            throw 'createNewElement then add attribute';
        }
        return this;
    },
    addText: function (text) {
        if (this.newElement !== 'undefined') {
            this.newElement.appendChild(document.createTextNode(text));
        } else {
            throw 'createNewElement then add text';
        }
        return this;
    },
    toDomString: function () {
        return this.newElement;
    }
};


var krapUtil ={
    calcTot : function(data){
        var tot = data.reduce(function(previousValue, currentValue) {
  return previousValue + currentValue;
});
    return tot;
    },
    getPosition: function (el) {
            var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { x: rect.top + scrollTop, y: rect.left + scrollLeft };
}
};

var krapStats ={
    calcRangeOnSorted : function (arr){
     var len = arr.length;
     var range = (arr[length-1]-arr[0])/(len-1);
     return range;
    },
    
    calcRangeOnNonSortedData : function (arr){
     arr.sort();
     var len = arr.length;
     var range = (arr[length-1]-arr[0])/(len-1);
     return range;
    }
};

function generateArcSector(svg,cX,cY,radius,datum,colour,iniA,endA,sweep){
cX = parseInt(cX);
cY = parseInt(cY);
radius = parseInt(radius);
iniA = parseInt(iniA);
var x1 = cX + radius * Math.cos((iniA) * Math.PI/180 )
var y1 = cY + radius * Math.sin((iniA) * Math.PI/180 )

var x2 = cX + radius * Math.cos((endA) * Math.PI/180 )
var y2 = cY + radius * Math.sin((endA) * Math.PI/180 )

var path = 'M'+cX+','+cY+' L'+x1+','+y1+' A'+radius+','+radius+' 0 '+sweep+',1 '+x2+','+y2+' z';
console.log(path);
var pathNode = fnSvgElement.createNewElement('path')
			.addAttribute('d',path)
                        .addAttribute('stroke-width','0.1')
                        .addAttribute('class','conic')
                        .addAttribute('stroke','black')
                        .addAttribute('data-name','test')
                        .addAttribute('fill',colour)
                        .toDomString();
    svg.appendChild(pathNode);
}
var sketch = {
};

krapException = {
    generalCheck: function (actual, expected) {
        if (actual === expected) {
            return !0;
        } else {
            return !1;
        }
    },
    checkId: function (id) {
        if (this.generalCheck(id, null)) {
            throw Error(errorMessages.inf);
        } else {
            return !0;
        }
    },
    checkObject: function (obj) {
        if (this.generalCheck(obj, krapAttr.undefined)) {
            throw Error(errorMessages.cou);
        } else {
            return !0;
        }
    }

};

var krapPie = {
    svgObject: 'undefined',
    properties: {
        width: '',
        height: '',
        data: [],
        colours: []
    },
    create: function (eleId) {
        var div = document.getElementById(eleId);
        if (krapException.checkId(div)) {
            this.svgObject = fnSvgElement.createNewElement('svg')
                    .addAttribute('width',this.properties.width)
                    .addAttribute('height',this.properties.height)
                    .toDomString();
            div.appendChild(this.svgObject);
            return this;
        } else {
            throw Error(errorMessages.stw);
        }
    },
    generate: function () {
        var ht = parseInt(this.properties.height);
        var wt = parseInt(this.properties.width);
        var tot = krapUtil.calcTot(this.properties.data);
        var radius = (ht+wt)/4-(0.3*((ht+wt)/4));
        console.log('radius'+' '+((ht+wt)/2)+' '+(0.3*((ht+wt)/2))+' '+radius);
        var len = this.properties.data.length;
        var cl  = this.properties.colours.length;
        var iniA =0;
        var endA =0;
        var cord = krapUtil.getPosition(this.svgObject);
        console.log(cord);
        var cx = parseInt(cord.x) + (wt/2);
        var cy = parseInt(cord.y) + (ht/2);
        var sweep =0;
     gobj = fnSvgElement.createNewElement('g')
             .addAttribute('transform','translate(-8,-8)')
                        .toDomString();
            
        for(var i=0;i<len;i++){
            endA = iniA+((360*this.properties.data[i])/tot);
            console.log(cx+' '+cy+' '+this.properties.data+' '+len+' '+iniA+' '+endA+' '+tot+' '+radius);

            if(this.properties.data[i]>(tot/2))
            {
                sweep=1;
            }
            generateArcSector(gobj,cx,cy,radius,this.properties.data[i],this.properties.colours[i%cl],iniA,endA,sweep);
            iniA=endA;

        }
        this.svgObject.appendChild(gobj);
    },
    attribute: function (attr, value) {
        krapException.checkObject(this.svgObject);
        this.properties[attr] = value;
        this.svgObject.setAttribute(attr, value);
        return this;
    },
    data: function (dt) {
        krapException.checkObject(this.svgObject);
        this.properties.data = dt;
        this.generate();
        return this;
    },
};

var svg = {
    svgObj : 'undefined',
    generate : function(height,width){
        this.svgObj =  fnSvgElement.createNewElement('svg')
                    .addAttribute('width',width)
                    .addAttribute('height',height)
                    .toDomString();
            return this.svgObj;
    }
};


var axis = {
    
    
    generateSimpleAxis : function(svgId,xcords,ycords,height,width){
        var startX = (0.03)*width ;
        var startY = (0.05)*height;
        var oX = startX;
        var oY = height-(0.1 * height);
        var endX = width - (0.06 * width) ;
        var endY = oY;
        var lengthOfYAxis = oY-startY;
        var lengthOfXAxis = endX-oX;
        
        this.generateX();
        
        var axisPath = pathGenerator.move(startX,startY)+' '+pathGenerator.lineTo(oX,oY)+' '+pathGenerator.move(oX,oY)+' '+pathGenerator.lineTo(endX,endY)+' '+pathGenerator.completePath();
        var pathNode = fnSvgElement.createNewElement('path')
			.addAttribute('d',axisPath)
                        .addAttribute('stroke-width','1')
                        .addAttribute('class','axis')
                        .addAttribute('stroke','black')
                        .addAttribute('data-name','test')
                        .addAttribute('fill','none')
                        .toDomString();
                console.log(pathNode);
        document.getElementById(svgId).appendChild(pathNode);
    },
    generateMesh : function(){
        
    } 
};

var pathGenerator = {
  move : function(x,y){
    return 'M'+x+','+y;  
  },
  lineTo : function (x,y){
    return 'L'+x+','+y;  
  },
  completePath : function(){
    return 'z';  
  }
};

var chart = {
    pie: function (id,props) {
        for(var i in props){
            krapPie.properties[i] = props[i];
            
        }
        krapPie.create(id);
        krapPie.generate();
    },
    bar: function () {

    },
    line: function () {

    }
};
