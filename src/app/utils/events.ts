import { fromEvent } from 'rxjs';
import { map, take } from 'rxjs/operators';


const events = {
    windowLoadEvent: fromEvent(window, 'load')
};

// const pageLoaded = events.windowLoadEvent.pipe(take(1), map(event => console.log(`Event time: ${event.timeStamp}`))).toPromise();


export default events;