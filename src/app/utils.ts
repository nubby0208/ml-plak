import { Directive, ElementRef, Input, Renderer, SimpleChanges, Pipe, PipeTransform } from '@angular/core';
/**
 *
 * @param fields string[]
 *
 * Prepend minus to specify descending order
 *
 * myArray.sort(fieldSorter(['myArrayPropertie', '-myArrayPropertie2']))
 */
export const fieldSorter = (fields: string[]) => (a, b) => fields.map(o => {
  let dir = 1

  if (o[0] === '-') {
    dir = -1
    o = o.substring(1)
  }

  return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0
}).reduce((p, n) => p ? p : n, 0)

@Pipe({ name: 'tareaRealizadas' })
export class TareasRealizadas implements PipeTransform {
  transform(tarea) {
    if (tarea.length > 0)
      return tarea.filter(x => !x.realizado).length;
    else return 0;
  }
}

@Directive({ selector: 'img[imgPreview]' })
export class ImagePreview {

  @Input() image: any;

  constructor(private el: ElementRef, private renderer: Renderer) { }

  ngOnChanges(changes: SimpleChanges) {

    let reader = new FileReader();
    let el = this.el;

    reader.onloadend = function (e) {
      el.nativeElement.src = reader.result;
    };

    if (this.image) {
      return reader.readAsDataURL(this.image);
    }
  }
}
