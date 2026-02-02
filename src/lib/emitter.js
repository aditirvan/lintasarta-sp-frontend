import { Subject } from 'rxjs'

export default class Emitter {
     constructor(){
        this.subject = new Subject()
        this.payload = {}
     }
     
     emit(event, payload){
         this.payload = { ...this.payload, [event] : payload}
         this.subject.next(event)
     }
     listen(event, calback){
         this.subject.subscribe((e)=>{
             if(event == e){
                 calback(this.payload[e])
             }
         })
     }
}