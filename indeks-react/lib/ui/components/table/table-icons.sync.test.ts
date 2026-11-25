import { IX_TABLE_SORT_ICONS } from '@sb1/indeks-web';
import { describeInSync } from '../../../test-utils/sync';
import { TABLE_SORT_ICONS } from './TableContext';

// Sorteringsikonene rendres av React i overskriftene og legges inn av web
// componenten i ren HTML. Navnene dupliseres, og testen holder dem like.
describeInSync('Table-sorteringsikoner', { ...TABLE_SORT_ICONS }, IX_TABLE_SORT_ICONS);
