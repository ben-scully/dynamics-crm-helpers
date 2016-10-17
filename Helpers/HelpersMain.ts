import * as Sync from './HelpersSync';
import * as Async from './HelpersAsync';
import * as Fields from './HelpersFields';

const help = {}

for (let i in Sync) {
    help[i] = Sync[i];
}

for (let i in Async) {
    help[i] = Async[i];
}

for (let i in Fields) {
    help[i] = Fields[i];
}

export default help;