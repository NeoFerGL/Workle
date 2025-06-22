import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { Draggable } from '@fullcalendar/interaction';
import { EventService } from 'src/app/services/event.service';

interface CalendarEvent extends EventInput {
  id: string;
  parent?: string;
  subEvents?: CalendarEvent[];
}

@Component({
  selector: 'app-calendarios-screen',
  templateUrl: './calendarios-screen.component.html',
  styleUrls: ['./calendarios-screen.component.scss']
})
export class CalendariosScreenComponent implements AfterViewInit {
  @ViewChild('fullcalendar') fullcalendar: FullCalendarComponent;
  calendarOptions: any;
  events: EventInput[] = [];
  selectedParentEventId: string | null = null; // ID del evento principal seleccionado

  constructor(private eventService: EventService) {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      editable: true,
      droppable: true,
      events: this.events,
      eventClick: this.handleEventClick.bind(this),
      eventReceive: this.handleEventReceive.bind(this),
      eventDrop: this.handleEventDrop.bind(this),
      eventResize: this.handleEventResize.bind(this),
      timeZone: 'UTC' // Asegura que el calendario use UTC
    };
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  ngAfterViewInit(): void {
    this.makeEventsDraggable();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe(
      (response) => {
        const eventsWithSubevents = (response.results || response).map((event: any) => {
          const subEvents = event.sub_events_data?.map((sub: any) => ({
            ...sub,
            start: new Date(sub.start).toISOString(),
            end: sub.end ? new Date(sub.end).toISOString() : null,
          })) || [];

          return {
            ...event,
            start: new Date(event.start).toISOString(),
            end: event.end ? new Date(event.end).toISOString() : null,
            subEvents
          };
        });
        this.events = this.groupEvents(eventsWithSubevents);
        this.refreshEvents();
      },
      (error) => {
        console.error('Error loading events:', error);
      }
    );
  }


  groupEvents(events: CalendarEvent[]): CalendarEvent[] {
    const groupedEvents: CalendarEvent[] = [];
    const subEventsMap: { [key: string]: CalendarEvent[] } = {};

    events.forEach(event => {
      if (event.parent) {
        if (!subEventsMap[event.parent]) {
          subEventsMap[event.parent] = [];
        }
        subEventsMap[event.parent].push(event);
      } else {
        groupedEvents.push({ ...event, subEvents: subEventsMap[event.id] || [] });
      }
    });

    return groupedEvents;
  }

  parseDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString(); // Esto devuelve la fecha completa en UTC, incluyendo la hora
  }


  refreshEvents() {
    const calendarApi = this.fullcalendar.getApi();
    calendarApi.removeAllEvents();
    this.events.forEach(event => {
      calendarApi.addEvent(event);
      if (event['subEvents']) {
        event['subEvents'].forEach(sub => calendarApi.addEvent(sub));
      }
    });
  }


  makeEventsDraggable(): void {
    const container = document.getElementById('external-events');
    if (container) {
      new Draggable(container, {
        itemSelector: '.fc-event',
        eventData: (eventEl) => {
          const title = eventEl.innerText.trim();
          return { title, allDay: true };
        }
      });
    }
  }

  handleEventClick(arg) {
    if (!arg.event.id) {
      console.error('Event ID is missing');
      alert('This event is not saved in the backend and cannot be updated.');
      return;
    }

    this.selectedParentEventId = arg.event.extendedProps.parent || arg.event.id;

    let newName = prompt('Enter new event name:', arg.event.title);
    if (newName) {
      const updatedEvent = {
        id: arg.event.id,
        title: newName,
        start: arg.event.start,
        end: arg.event.end || arg.event.start,
        allDay: arg.event.allDay
      };

      this.eventService.updateEvent(arg.event.id, updatedEvent).subscribe(
        () => {
          arg.event.setProp('title', newName);
        },
        (error) => {
          console.error('Error updating event:', error);
        }
      );
    }
  }

  getParentEventId(droppedEvent: CalendarEvent): string | null {
    // Verifica que droppedEvent.start y droppedEvent.end estén definidos antes de proceder
    if (!droppedEvent.start || !droppedEvent.end) {
      return null;
    }

    // Asegura que tanto start como end sean instancias de Date si son válidos
    const droppedStart = typeof droppedEvent.start === 'string' || typeof droppedEvent.start === 'number' ? new Date(droppedEvent.start) : droppedEvent.start;
    const droppedEnd = typeof droppedEvent.end === 'string' || typeof droppedEvent.end === 'number' ? new Date(droppedEvent.end) : droppedEvent.end;

    // Busca un evento principal que esté en la misma fecha y tenga un horario que incluya el de droppedEvent
    const mainEvent = this.events.find(event =>
      event.start && event.end && // Verifica que el evento tenga start y end definidos
      (typeof event.start === 'string' || typeof event.start === 'number' ? new Date(event.start) : event.start) <= droppedStart &&
      (typeof event.end === 'string' || typeof event.end === 'number' ? new Date(event.end) : event.end) >= droppedEnd &&
      !event['parent'] // Asegura que sea un evento principal
    );

    // Si mainEvent se encuentra, convierte su id a string; si no, retorna null
    return mainEvent ? (mainEvent.id?.toString() ?? null) : null;
  }

  handleEventReceive(arg) {
    const parentEventId = this.getParentEventId(arg.event);

    const newEvent = {
      title: arg.event.title,
      start: new Date(arg.event.start).toISOString(),
      end: arg.event.end ? new Date(arg.event.end).toISOString() : new Date(arg.event.start).toISOString(),
      allDay: arg.event.allDay,
      parent: parentEventId ? parseInt(parentEventId) : null
    };

    this.eventService.addEvent(newEvent).subscribe(
      (data) => {
        if (data && data.id) {
          arg.event.setProp('id', data.id);
        } else {
          console.error('Error: No ID returned for new event.');
        }
      },
      (error) => {
        console.error('Error saving event:', error);
      }
    );
  }


  handleEventDrop(arg) {
    if (!arg.event.id) {
      console.error('Event ID is missing for dropped event');
      return;
    }

    const startUTC = new Date(arg.event.start).toISOString();
    const endUTC = arg.event.end ? new Date(arg.event.end).toISOString() : startUTC;

    const updatedEvent = {
      id: arg.event.id,
      title: arg.event.title,
      start: startUTC,
      end: endUTC,
      allDay: arg.event.allDay,
      parent: this.getParentEventId(arg.event)
    };

    this.eventService.updateEvent(arg.event.id, updatedEvent).subscribe(
      () => {
        console.log('Event updated after move');
      },
      (error) => {
        console.error('Error updating event after move:', error);
      }
    );
  }



  handleEventResize(arg) {
    if (!arg.event.id) {
      console.error('Event ID is missing for resized event');
      return;
    }

    const end = arg.event.allDay && arg.event.end ? new Date(arg.event.end.getTime() - 86400000) : arg.event.end;

    const updatedEvent = {
      id: arg.event.id,
      title: arg.event.title,
      start: arg.event.start,
      end: end,
      allDay: arg.event.allDay
    };

    this.eventService.updateEvent(arg.event.id, updatedEvent).subscribe(
      () => {
        console.log('Evento actualizado después de cambiar la duración');
      },
      (error) => {
        console.error('Error al actualizar el evento después de cambiar la duración:', error);
      }
    );
  }
}
