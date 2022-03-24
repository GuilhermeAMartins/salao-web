import { all , takeLatest , call , put  } from 'redux-saga/effects';
import types from './types';
import { updateAgendament } from './actions';
import api from '../../../services/api';
import consts from '../../../consts';

export function* filterAgendamento({ star, end}) {
    try {
        const { data: res } = yield call(api.post, '/agendamento/filter', {
            salaoId: consts.salaoId,
            periodo: {
                inicio: star,
                final: end ,
            },
        });

        if(res.error){
            alert(res.message);
            return false;
        }

        yield put(updateAgendament(res.agendamentos));
        
        console.log(res.data);
    } catch (error) {
        alert(error.message);
    }

}
  
export default all([takeLatest(types.FILTER_AGENDAMENTOS, filterAgendamento)]);