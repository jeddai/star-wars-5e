import {Pipe, PipeTransform} from '@angular/core';
import * as marked from 'marked';

@Pipe({ name: 'markdown' })
export class MarkdownPipe implements PipeTransform {
    public transform(markdown: string, options?: marked.MarkedOptions): string {
      if (markdown == null) { return ''; }
      return marked(markdown, options);
    }

    public setOptions(options: marked.MarkedOptions): void {
      marked.setOptions(options);
    }
}
