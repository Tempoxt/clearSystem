/**
 * jQuery org-chart/tree plugin.
 *
 * Author: Wes Nolte
 * http://twitter.com/wesnolte
 *
 * Based on the work of Mark Lee
 * http://www.capricasoftware.co.uk
 *
 * Copyright (c) 2011 Wesley Nolte
 * Dual licensed under the MIT and GPL licenses.
 *
 */
(function ($) {
  var pan = {
    _closest(el, fn) {
      return el && ((fn(el) && el !== this.chart) ? el : this._closest(el.parentNode, fn));
    },
    _onPanStart:function(event) {
        var chart = event.currentTarget;
        if (this._closest(event.target, (el) => el.classList && el.classList.contains('node')) ||
          (event.touches && event.touches.length > 1)) {
          chart.dataset.panning = false;
          return;
        }
        chart.style.cursor = 'move';
        chart.dataset.panning = true;

        var lastX = 0,
          lastY = 0,
          lastTf = window.getComputedStyle(chart).transform;

        if (lastTf !== 'none') {
          var temp = lastTf.split(',');

          if (!lastTf.includes('3d')) {
            lastX = Number.parseInt(temp[4], 10);
            lastY = Number.parseInt(temp[5], 10);
          } else {
            lastX = Number.parseInt(temp[12], 10);
            lastY = Number.parseInt(temp[13], 10);
          }
        }
        var startX = 0,
          startY = 0;

        if (!event.targetTouches) { // pan on desktop
          startX = event.pageX - lastX;
          startY = event.pageY - lastY;
        } else if (event.targetTouches.length === 1) { // pan on mobile device
          startX = event.targetTouches[0].pageX - lastX;
          startY = event.targetTouches[0].pageY - lastY;
        } else if (event.targetTouches.length > 1) {
          return;
        }
        chart.dataset.panStart = JSON.stringify({ 'startX': startX, 'startY': startY });
        chart.addEventListener('mousemove', this._onPanning.bind(this));
        chart.addEventListener('touchmove', this._onPanning.bind(this));
  },
  _onPanning:function(event) {
      var chart = event.currentTarget;
      if (chart.dataset.panning === 'false') {
        return;
      }
      var newX = 0,
        newY = 0,
        panStart = JSON.parse(chart.dataset.panStart),
        startX = panStart.startX,
        startY = panStart.startY;

      if (!event.targetTouches) { // pand on desktop
        newX = event.pageX - startX;
        newY = event.pageY - startY;
      } else if (event.targetTouches.length === 1) { // pan on mobile device
        newX = event.targetTouches[0].pageX - startX;
        newY = event.targetTouches[0].pageY - startY;
      } else if (event.targetTouches.length > 1) {
        return;
      }
      var lastTf = window.getComputedStyle(chart).transform;

      if (lastTf === 'none') {
        if (!lastTf.includes('3d')) {
          chart.style.transform = 'matrix(1, 0, 0, 1, ' + newX + ', ' + newY + ')';
        } else {
          chart.style.transform = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ' + newX + ', ' + newY + ', 0, 1)';
        }
      } else {
        var matrix = lastTf.split(',');

        if (!lastTf.includes('3d')) {
          matrix[4] = newX;
          matrix[5] = newY + ')';
        } else {
          matrix[12] = newX;
          matrix[13] = newY;
        }
        chart.style.transform = matrix.join(',');
      }
  },
  _onPanEnd:function(event) {
      var chart = this.chart[0];
      chart.dataset.panning = false;
      chart.style.cursor = 'default';
      document.body.removeEventListener('mousemove', this._onPanning);
      document.body.removeEventListener('touchmove', this._onPanning);
  }
}
  $.fn.jOrgChart = function (options) {
    var opts = $.extend({}, $.fn.jOrgChart.defaults, options)
    var $appendTo = $(opts.chartElement)

    // build the tree
    var $this = $(this)
    var $container = $("<div class='" + opts.chartClass + "'/>")
    if ($this.is('ul')) {
      buildNode($this.find('li:first'), $container, 0, opts)
    } else if ($this.is('li')) {
      buildNode($this, $container, 0, opts)
    }
    $appendTo.append($container)
    // add pan
    pan.chart = $container;
    pan.dataset = {};
    pan.chart.dataset = {};
    $container[0].addEventListener('mousedown', pan._onPanStart.bind(pan));
    $container[0].addEventListener('touchstart', pan._onPanStart.bind(pan));
    document.body.addEventListener('mouseup', pan._onPanEnd.bind(pan));
    document.body.addEventListener('touchend', pan._onPanEnd.bind(pan));


    // add drag and drop if enabled
    if (opts.dragAndDrop) {
      $('div.node').draggable({
        cursor: 'move',
        distance: 40,
        helper: 'clone',
        opacity: 0.8,
        revert: 'invalid',
        revertDuration: 100,
        snap: 'div.node.expanded',
        snapMode: 'inner',
        stack: 'div.node'
      })

      $('div.node').droppable({
        accept: '.node',
        activeClass: 'drag-active',
        hoverClass: 'drop-hover'
      })

      // Drag start event handler for nodes
      $('div.node').bind('dragstart', function handleDragStart (event, ui) {
        var sourceNode = $(this)
        sourceNode.parentsUntil('.node-container')
          .find('*')
          .filter('.node')
          .droppable('disable')
      })

      // Drag stop event handler for nodes
      $('div.node').bind('dragstop', function handleDragStop (event, ui) {
        /* reload the plugin */
        $(opts.chartElement).children().remove()
        $this.jOrgChart(opts)
      })

      // Drop event handler for nodes
      $('div.node').bind('drop', function handleDropEvent (event, ui) {
        var targetID = $(this).data('tree-node')
        var targetLi = $this.find('li').filter(function () { return $(this).data('tree-node') === targetID })
        var targetUl = targetLi.children('ul')

        var sourceID = ui.draggable.data('tree-node')
        var sourceLi = $this.find('li').filter(function () { return $(this).data('tree-node') === sourceID })
        var sourceUl = sourceLi.parent('ul')

        if (targetUl.length > 0) {
          targetUl.append(sourceLi)
        } else {
          targetLi.append('<ul></ul>')
          targetLi.children('ul').append(sourceLi)
        }

        // Removes any empty lists
        if (sourceUl.children().length === 0) {
          sourceUl.remove()
        }
      }) // handleDropEvent
    } // Drag and drop
  }

  // Option defaults
  $.fn.jOrgChart.defaults = {
    chartElement: 'body',
    depth: -1,
    chartClass: 'jOrgChart',
    dragAndDrop: false
  }

  var nodeCount = 0
  // Method that recursively builds the tree
  function buildNode ($node, $appendTo, level, opts) {
    var $table = $("<table cellpadding='0' cellspacing='0' border='0'/>")
    var $tbody = $('<tbody/>')

    // Construct the node container(s)
    var $nodeRow = $('<tr/>').addClass('node-cells')
    var $nodeCell = $('<td/>').addClass('node-cell').attr('colspan', 2)
    var $childNodes = $node.children('ul:first').children('li')
    var $nodeDiv

    if ($childNodes.length > 1) {
      $nodeCell.attr('colspan', $childNodes.length * 2)
    }
    // Draw the node
    // Get the contents - any markup except li and ul allowed
    var $nodeContent = $node.clone()
      .children('ul,li')
      .remove()
      .end()
      .html()

    // Increaments the node count which is used to link the source list and the org chart
    nodeCount++
    $node.data('tree-node', nodeCount)
    $nodeDiv = $('<div>').addClass('node')
      .data('tree-node', nodeCount)
      .append($nodeContent)

    // Expand and contract nodes
    if ($childNodes.length > 0) {
      $nodeDiv.click(function () {
        var $this = $(this)
        var $tr = $this.closest('tr')

        if ($tr.hasClass('contracted')) {
          $this.css('cursor', 'n-resize')
          $this.attr('cursor', 'n-resize')
          $this.addClass('active')
          $tr.removeClass('contracted').addClass('expanded')
          $tr.nextAll('tr').css('visibility', '')

          // Update the <li> appropriately so that if the tree redraws collapsed/non-collapsed nodes
          // maintain their appearance
          $node.removeClass('collapsed')
        } else {
          $this.css('cursor', 's-resize')
          $this.attr('cursor', 's-resize')
          $this.addClass('active')
          $tr.removeClass('expanded').addClass('contracted')
          $tr.nextAll('tr').css('visibility', 'hidden')

          $node.addClass('collapsed')
        }
      })
    }

    $nodeCell.append($nodeDiv)
    $nodeRow.append($nodeCell)
    $tbody.append($nodeRow)

    if ($childNodes.length > 0) {
      // if it can be expanded then change the cursor
      $nodeDiv.css('cursor', 'n-resize')
      $nodeDiv.attr('cursor', 'n-resize')
      $nodeDiv.addClass('active')

      // recurse until leaves found (-1) or to the level specified
      if (opts.depth == -1 || (level + 1 < opts.depth)) {
        var $downLineRow = $('<tr/>')
        var $downLineCell = $('<td/>').attr('colspan', $childNodes.length * 2)
        $downLineRow.append($downLineCell)

        // draw the connecting line from the parent node to the horizontal line
        var $downLine = $('<div></div>').addClass('line down')
        $downLineCell.append($downLine)
        $tbody.append($downLineRow)

        // Draw the horizontal lines
        var $linesRow = $('<tr/>')
        $childNodes.each(function () {
          var $left = $('<td>&nbsp;</td>').addClass('line left top')
          var $right = $('<td>&nbsp;</td>').addClass('line right top')
          $linesRow.append($left).append($right)
        })

        // horizontal line shouldn't extend beyond the first and last child branches
        $linesRow.find('td:first')
          .removeClass('top')
          .end()
          .find('td:last')
          .removeClass('top')

        $tbody.append($linesRow)
        var $childNodesRow = $('<tr/>')
        $childNodes.each(function () {
          if(level<=1){
            var $td = $("<td class='node-container node-pd'/>")
          }else{
            var $td = $("<td class='node-container'/>")
          }
          
          
          $td.attr('colspan', 2)
          // recurse through children lists and items
          buildNode($(this), $td, level + 1, opts)
          $childNodesRow.append($td)
        })
      }
      $tbody.append($childNodesRow)
    }

    // any classes on the LI element get copied to the relevant node in the tree
    // apart from the special 'collapsed' class, which collapses the sub-tree at this point
    if ($node.attr('class') != undefined) {
      var classList = $node.attr('class').split(/\s+/)
      $.each(classList, function (index, item) {
        if (item == 'collapsed') {
          console.log($node)
          $nodeRow.nextAll('tr').css('visibility', 'hidden')
          $nodeRow.removeClass('expanded')
          $nodeRow.addClass('contracted')
          $nodeDiv.css('cursor', 's-resize')
          $nodeDiv.attr('cursor', 's-resize')
          $nodeDiv.addClass('active')
        } else {
          $nodeDiv.addClass(item)
        }
      })
    }

    $table.append($tbody)
    $appendTo.append($table)

    /* Prevent trees collapsing if a link inside a node is clicked */
    $nodeDiv.children('a').click(function (e) {
      console.log(e)
      e.stopPropagation()
    })
  };
})(jQuery)
