import { all , takeLatest , call , put , select } from 'redux-saga/effects';
import types from './types';
import { updateHorario , allHorarios as allHorariosAction , resetHorario } from './actions';
import api from '../../../services/api';
import consts from '../../../consts';


export function* allHorarios() {
    
    const { form } = yield select((state) => state.horario);

    try {
        yield put(updateHorario({ form : {...form, filtering: true} }));
        const { data: res } = yield call(
            api.get, 
            `/horario/salao/${consts.salaoId}`);

        yield put(updateHorario({ form : {...form, filtering: false} }));

        if(res.error){
            alert(res.message);
            return false;
        }

        yield put(updateHorario({ horarios: res.horarios }));
        
        
    } catch (error) {
        yield put(updateHorario({ form : {...form, filtering: false} }));
        alert(error.message);
    }

}
    
export function* allServicos(){
    const { form } = yield select((state) => state.horario);

    try {
        yield put(updateHorario({ form : { ...form, filtering : true}}));
        const { data: res} = yield call(
            api.get,
            `/salao/servicos/${consts.salaoId}`
        );
        yield put(updateHorario({ form : { ...form, filtering : true}}));

        if(res.error){
            alert(res.message);
            return false;
        }
        yield put(updateHorario({ servicos : res.servicos}));
        
    } catch (error) {
        yield put(updateHorario({ form : { ...form, filtering : false}}));
    }
}

export function* filterColaboradores(){
    const { form , horario } = yield select((state) => state.horario);

    try {
        yield put(updateHorario({ form : { ...form, filtering : true}}));
        const { data: res} = yield call(
            api.post,
            `/horario/colaboradores`,
            { especialidades: horario.especialidades}
        );
        yield put(updateHorario({ form : { ...form, filtering : true}}));

        if(res.error){
            alert(res.message);
            return false;
        }
        yield put(updateHorario({ colaboradores : res.listaColaboradores}));
        
    } catch (error) {
        yield put(updateHorario({ form : { ...form, filtering : false}}));
    }
}

export function* addHorario() {
    const { form, horario , components , behavior} = yield select((state) => state.horario);
console.log(horario)
    
    const horarioDate = { inicio : new Date(horario.inicio), fim : new Date(horario.fim)}
    const horarioISO ={...horario , inicio : horarioDate.inicio.toISOString(), fim : horarioDate.fim.toISOString()}
console.log(horarioISO)
    try {
        yield put(updateHorario({ form : {...form, saving: true} }));
    let res = {};
    if(behavior === 'create'){
            const response = yield call(api.post, `/horario`, {
                ...horario,
                salaoId: consts.salaoId,
            });
            res = response.data;
        }else{
            const response = yield call(api.put, `/horario/${horario._id}`,horarioISO);
            res = response.data;
        }
        
        yield put(updateHorario({ form : {...form, saving: false} }));
 

        if(res.error){
            alert(res.message);
            return false;
        }

        yield put(allHorariosAction());
        yield put(updateHorario({ components : {...components, drawer: false} }));
        yield put(resetHorario());

    } catch (error) {
        yield put(updateHorario({ form : {...form, saving: false} }));
        alert(error.message);
    }

}

export function* removeHorario() {
    
    const { form , horario , components} = yield select((state) => state.horario);

    try {
        yield put(updateHorario({ form : {...form, filtering: true} }));
        const { data: res } = yield call(
            api.delete, 
            `/horario/${horario._id}`);

        yield put(updateHorario({ form : {...form, filtering: false} }));

        if(res.error){
            alert(res.message);
            return false;
        }

        yield put(allHorariosAction());
        yield put(updateHorario({ components : {...components, drawer: false, confirmDelete: false} }));
        yield put(resetHorario());        
        
    } catch (error) {
        yield put(updateHorario({ form : {...form, filtering: false} }));
        alert(error.message);
    }

}

export default all([
    takeLatest(types.ALL_HORARIOS, allHorarios),
    takeLatest(types.ALL_SERVICOS, allServicos),
    takeLatest(types.ADD_HORARIO, addHorario),
    takeLatest(types.FILTER_COLABORADORES, filterColaboradores),
    takeLatest(types.REMOVE_HORARIO, removeHorario),

 
]);