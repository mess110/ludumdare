function animateModelChangeDirective(e){function n(n,t,a){function r(e){var n=e.split(" ").filter(function(e){return e.indexOf("ng-")>-1?void 0:e});return n[n.length-1]}function i(n,a){if(n!==a){var r=d;l&&(e.cancel(l),l=null,o()),angular.isNumber(Number(n))&&!isNaN(Number(n))&&(r=Number(n)<Number(a)?c:s),t.addClass(r),l=e(function(){o()},Number(m))}}function o(){t.removeClass(s),t.removeClass(c),t.removeClass(d)}var l=null,m=a.timeout||getTransitionDuration(t[0],a.$normalize)||300,u=r(t.attr("class"))||"model",s=a.incrementClass||u+"--increment",c=a.decrementClass||u+"--decrement",d=a.nonNumberClass||u+"--non-number";n.$watch(function(){return a.model},i)}return{replace:!0,restrict:"A",link:n}}function getTransitionDuration(e,n){for(var t,a,r,i=" webkit moz ms o khtml".split(" "),o=0,l=getComputedStyle(e),m=0;m<i.length;m++)if(r=i[m]+"-",""===i[m]&&(r=""),t=l[n(r+"transition-duration")]){t=t.indexOf("ms")>-1?parseFloat(t):1e3*parseFloat(t),a=l[n(r+"transition-delay")],a&&(t+=a.indexOf("ms")>-1?parseFloat(a):1e3*parseFloat(a)),o=t;break}return o}angular.module("dm.animateModelChange",[]).directive("animateModelChange",animateModelChangeDirective),animateModelChangeDirective.$inject=["$timeout"];