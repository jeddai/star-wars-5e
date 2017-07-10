import * as _ from 'lodash';

export class Gadget {
  constructor() {
    this.name = null;
    this.type = null;
    this.subtype = null;
    this.activation = null;
    this.desc = null;
    this.level = null;
    this.restrictions = null;
  }

  name: string
  type: string
  subtype: string
  activation: string
  desc: string
  level: number
  restrictions: string

  public static MakeGadget(g: Gadget): Gadget {
    var newGadget = new Gadget();
    newGadget.name = g.name;
    newGadget.type = _.lowerCase(g.type);
    newGadget.subtype = _.lowerCase(g.subtype);
    newGadget.activation = _.words(_.lowerCase(g.activation)).join(', ');
    newGadget.desc = g.desc;
    newGadget.level = g.level;
    newGadget.restrictions = _.words(_.lowerCase(g.restrictions)).join(', ');
    return newGadget;
  }
}