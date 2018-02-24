class Genome {
  constructor (cfg) {
    this.name = cfg.name;
    this.label= cfg.label;
    this.chromosomes = [];
    this.maxlen = -1;
    this.xscale = null;
    this.yscale = null;
    this.zoomY  = -1;
  }
  getChromosome (n) {
      if (typeof(n) === 'string')
	  return this.chromosomes.filter(c => c.name === n)[0];
      else
          return this.chromosomes[n];
  }
  hasChromosome (n) {
      return this.getChromosome(n) ? true : false;
  }
}

export { Genome };
