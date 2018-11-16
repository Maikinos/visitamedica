
!function($) {
    "use strict";

    var CalendarApp = function() {
        this.$body = $("body")
        this.$calendar = $('#calendar'),
        this.$event = ('#calendar-events div.calendar-events'),
        this.$categoryForm = $('#add-new-event form'),
        this.$extEvents = $('#calendar-events'),
        this.$modal = $('#my-event'),
        this.$saveCategoryBtn = $('.save-category'),
        this.$calendarObj = null
    };

    CalendarApp.prototype.onDrop = function (eventObj, date) { 
        var $this = this;
            // retrieve the dropped element's stored Event Object
            var originalEventObject = eventObj.data('eventObject');
            var $categoryClass = eventObj.attr('data-class');
            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);
            // assign it the date that was reported
            copiedEventObject.start = date;
            if ($categoryClass)
                copiedEventObject['className'] = [$categoryClass];
            // render the event on the calendar
            $this.$calendar.fullCalendar('renderEvent', copiedEventObject, true);
            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                eventObj.remove();
            }
    },
/*
    CalendarApp.prototype.onEventClick =  function (calEvent, jsEvent, view) {
        var $this = this;
            var form = $("<form></form>");
            form.append("<label>Cambiar nombre de Visita</label>");
            form.append("<div class='input-group'><input class='form-control' type=text value='" + calEvent.title + "' /><span class='input-group-btn'><button type='submit' class='btn btn-success waves-effect waves-light'><i class='fa fa-check'></i> Actualziar</button></span></div><select class='seleccion-medico-m'><option value='valo1'>valo1</option><option value='valo2'>valo2</option><option value='valo3'>valo3</option><option value='valo4'>valo4</option></select><select class='seleccion-medico-m'><option value='valo1'>valo1</option><option value='valo2'>valo2</option><option value='valo3'>valo3</option><option value='valo4'>valo4</option></select>");
            $this.$modal.modal({
                backdrop: 'static'
            });
            $this.$modal.find('.delete-event').show().end().find('.save-event').hide().end().find('.modal-body').empty().prepend(form).end().find('.delete-event').unbind('click').click(function () {
                $this.$calendarObj.fullCalendar('removeEvents', function (ev) {
                    return (ev._id == calEvent._id);
                });
                $this.$modal.modal('hide');
            });
            $this.$modal.find('form').on('submit', function () {
                calEvent.title = form.find("input[type=text]").val();
                $this.$calendarObj.fullCalendar('updateEvent', calEvent);
                $this.$modal.modal('hide');
                return false;
            });
    },

    CalendarApp.prototype.onSelect = function (start, end, allDay) {
        var $this = this;
            $this.$modal.modal({
                backdrop: 'static'
            });
            var form = $("<form></form>");
            form.append("<div class='row'></div>");
            form.find(".row")
                .append("<div class='col-md-6'><div class='form-group'><label class='control-label'>Visita</label><input class='form-control' placeholder='' type='text' name='title'/></div></div>")
                .append("<div class='col-md-6'><div class='form-group'><label class='control-label'>Estado</label><select class='form-control' name='category'></select></div></div>")
                .append("<select class='seleccion-medico-m'><option value='valo1'>valo1</option><option value='valo2'>valo2</option><option value='valo3'>valo3</option><option value='valo4'>valo4</option></select><select class='seleccion-medico-m'><option value='valo1'>valo1</option><option value='valo2'>valo2</option><option value='valo3'>valo3</option><option value='valo4'>valo4</option></select>")
                .find("select[name='category']")
                .append("<option value='bg-danger'>Realizada</option>")
                .append("<option value='bg-success'>Programada</option>")
                .append("<option value='bg-purple'>Reportada</option>")
                .append("<option value='bg-primary'>No programada</option>");
            
            $this.$modal.find('.delete-event').hide().end().find('.save-event').show().end().find('.modal-body').empty().prepend(form).end().find('.save-event').unbind('click').click(function () {
                form.submit();
            });

            $this.$modal.find('form').on('submit', function () {
                var title = form.find("input[name='title']").val();
                var beginning = form.find("input[name='beginning']").val();
                var ending = form.find("input[name='ending']").val();
                var categoryClass = form.find("select[name='category'] option:checked").val();
                if (title !== null && title.length != 0) {
                    $this.$calendarObj.fullCalendar('renderEvent', {
                        title: title,
                        start:start,
                        end: end,
                        allDay: false,
                        className: categoryClass
                    }, true);  
                    $this.$modal.modal('hide');
                }
                else{
                    alert('You have to give a title to your event');
                }
                return false;
                
            });
            $this.$calendarObj.fullCalendar('unselect');
    }, */
    CalendarApp.prototype.enableDrag = function() {
        //init events
        $(this.$event).each(function () {
            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim($(this).text()) // use the element's text as the event title
            };
            // store the Event Object in the DOM element so we can get to it later
            $(this).data('eventObject', eventObject);
            
            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 999,
                revert: true,      // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            });
        });
    }
    /* Initializing */
    CalendarApp.prototype.init = function() {
        this.enableDrag();
        /*  Initialize the calendar  */
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        var form = '';
        var today = new Date($.now());

        var defaultEvents =  [{
                title: 'Jean Criado',
                start: new Date($.now() + 2073600),
                className: 'bg-info'
            }, {
                title: 'Nora Alvarado',
                start: new Date($.now() - 106800000),
                className: 'bg-info'
            }, {
                title: 'Victor Mateo',
                start: new Date($.now() - 206800000),
                className: 'bg-success'
            },{
                title: 'Rodolfo Suarez',
                start: today,
                end: today,
                className: 'bg-success'
            }];
            
        var $this = this;
        $this.$calendarObj = $this.$calendar.fullCalendar({
            slotDuration: '00:15:00', /* If we want to split day time each 15minutes */
            minTime: '08:00:00',
            maxTime: '19:00:00',  
            defaultView: 'month',  
            handleWindowResize: true,   
             
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            events: defaultEvents,
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar !!!
            eventLimit: true, // allow "more" link when too many events
            selectable: true,

            //SOLTAR EL MEDICO EN LA FECHA SELECCIONADPO
            drop: function(date) { $this.onDrop($(this), date); },
            select: function (start, end, allDay) { $this.onSelect(start, end, allDay); },
            //eventClick: function(calEvent, jsEvent, view) { $this.onEventClick(calEvent, jsEvent, view); }
        });

        //on new event
        this.$saveCategoryBtn.on('click', function(){
            var categoryName = $this.$categoryForm.find("input[name='category-name']").val();
            var categoryColor = $this.$categoryForm.find("select[name='category-color']").val();
            if (categoryName !== null && categoryName.length != 0) {
                $this.$extEvents.append('<div class="calendar-events" data-class="bg-' + categoryColor + '" style="position: relative;"><i class="fa fa-circle text-' + categoryColor + '"></i>' + categoryName + '</div>')
                $this.enableDrag();
            }
            //- menor error actual

        });
    },

   //init CalendarApp
    $.CalendarApp = new CalendarApp, $.CalendarApp.Constructor = CalendarApp
    
}(window.jQuery),

//initializing CalendarApp
function($) {
    "use strict";
    $.CalendarApp.init();
}(window.jQuery);

/*checkbox filtros*/
$("#styled-checkbox-1").on( 'change', function() {
    if( $(this).is(':checked') ) {
    // Hacer algo si el checkbox ha sido seleccionado
    $('.bg-info').show();
    } else {
    // Hacer algo si el checkbox ha sido deseleccionado
    $('.bg-info').hide();
    }
    });

    $("#styled-checkbox-2").on( 'change', function() {
    if( $(this).is(':checked') ) {
    // Hace algo si el checkbox ha sido selecionado
    $('.bg-success').show();
    } else {
    // Hacer algo si el checkbox ha sido deseleccionado
    $('.bg-success').hide();
    }
    });

    $("#styled-checkbox-3").on( 'change', function() {
    if( $(this).is(':checked') ) {
    // Hacer algo si el checkbox ha sido seleccionado
    $('.bg-danger').show();
    } else {
    // Hacer algo si el checkbox ha sido deseleccionado
    $('.bg-danger').hide();
    }
    });

    $("#styled-checkbox-4").on( 'change', function() {
    if( $(this).is(':checked') ) {
    // Hacer algo si el checkbox ha sido seleccionado
    $('.bg-warning').show();
    } else {
    // Hacer algo si el checkbox ha sido deseleccionado
    $('.bg-warning').hide();
    }
    });

$( "#filtros-busqueda-movil" ).click(function() {
    $('.panel-filtros-c').toggleClass('movimiento-traslativo');
  }, function() {
    $('.panel-filtros-c').toggleClass('movimiento-traslativo');
  });

  /*detecta la cantidad d planificaciones o registros*/

  var indicadorcreportada = $('.fc-day-grid-event.bg-info').length;
  var indicadorcnoreportada = $('.fc-day-grid-event.bg-success').length;
    $('span.indicador-r').html(indicadorcreportada);
    $('span.indicador-sr').html(indicadorcnoreportada);

/* MUESTRA MODAL SEGUN SEA INSTITUCION O MEDICO */

$('.fc-event-container').on('click', function(){

    
    compruebaim = $(this).find('.fc-title').html();

    pat1 = /Mateo/;
    pat2 = /Suarez/;
        
    siinst = pat1.test(compruebaim);
    siinstd = pat2.test(compruebaim);

    if (siinst || siinstd) {
        $('#botonm1').click();
        $('#clonar-planificacion').hide();
        $('.rplani').show();
        $('.aplani').hide();
        $('#exampleModalLabel').show();
        $('#exampleModalLabelCAMBIO').hide();
    }

    else{
        $('#botonm1').click();
        $('#clonar-planificacion').show();
        $('.rplani').hide();
        $('.aplani').show();
        $('#exampleModalLabel').show();
        $('#exampleModalLabelCAMBIO').show();
        
    }
    
});

   $('#calendar').bind("DOMSubtreeModified",function(){
    var indicadorcreportada = $('.fc-day-grid-event.bg-info').length;
  var indicadorcnoreportada = $('.fc-day-grid-event.bg-success').length;
    $('span.indicador-r').html(indicadorcreportada);
    $('span.indicador-sr').html(indicadorcnoreportada);

    /* MUESTRA MODAL SEGUN SEA INSTITUCION O MEDICO */

$('.fc-event-container').on('click', function(){

    compruebaim = $(this).find('.fc-title').html();

    pat1 = /Mateo/;
    pat2 = /Suarez/;
        
    siinst = pat1.test(compruebaim);
    siinstd = pat2.test(compruebaim);

    if (siinst || siinstd) {
        $('#botonm1').click();
        $('#clonar-planificacion').hide();
        $('.rplani').show();
        $('.aplani').hide();
        $('#exampleModalLabel').show();
        $('#exampleModalLabelCAMBIO').hide();
    }

    else{
        $('#botonm1').click();
        $('#clonar-planificacion').show();
        $('.rplani').hide();
        $('.aplani').show();
        $('#exampleModalLabel').show();
        $('#exampleModalLabelCAMBIO').show();
        
    }
        
});

  });
  