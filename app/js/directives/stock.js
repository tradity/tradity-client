'use strict';

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

angular.module('tradity').
  directive('stock', function($compile,stock) {
    function link(scope, element, attrs) {
      console.log(element)
      scope.template = false;
      var enter = function() {
        console.log(attrs.isin)
        stock.getComments(attrs.isin).then(function(comments){
          scope.comments = comments;
          scope.template = 'templates/popover.stock.html'
          console.log(comments)
        })
        var el = $('.popover',this);
        el.show()
        var pos = $(this).offset();
        var h = $(this).height();
        var w = $(this).width();
        var left = pos.left-(el.width()/2)+(w/2);
        var top = pos.top+10+h;
        var arrowOff = 0;
        if(left < 0) {
          arrowOff = left-(w/2);
          el.offset({ top: top, left: 0 })
          $('.arrow',el).css('margin-left',arrowOff)
        }
        else
          el.offset({ top: top, left: left });
        element.unbind('mouseenter')
        element.bind('mouseout',function(){
          element.unbind('mouseout')
          el.hide();
          element.bind('mouseenter',enter)
        })
      }
      element.bind('mouseenter',enter)
    }
    
    return {
      link: link,
      templateUrl: 'templates/popover.html',
      scope:{
        isin:'@',
        title:'@'
      }
    };
  });
