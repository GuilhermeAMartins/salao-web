import { all , takeLatest , call , put , select } from 'redux-saga/effects';
import types from './types';
import { updateServico , allServicos as allServicosAction , resetServico } from './actions';
import api from '../../../services/api';
import consts from '../../../consts';

export function* allServicos() {
    
    const { form } = yield select((state) => state.servico);

    try {
        yield put(updateServico({ form : {...form, filtering: true} }));
        const { data: res } = yield call(
            api.get, 
            `/servico/salao/${consts.salaoId}`);

        yield put(updateServico({ form : {...form, filtering: false} }));

        if(res.error){
            alert(res.message);
            return false;
        }
        yield put(updateServico({ servicos: res.servicos }));
        
        
    } catch (error) {
        yield put(updateServico({ form : {...form, filtering: false} }));
        alert(error.message);
    }

}
    
export function* addServico() {
    const { form, servico , components , behavior} = yield select((state) => state.servico);
    const servicoComSalaoId = {...servico,salaoId : consts.salaoId};
    
    try {
        yield put(updateServico({ form : {...form, saving: true} }));
        const formData = new FormData();
        formData.append('servico', JSON.stringify(servicoComSalaoId));
        formData.append('salaoId', consts.salaoId);
        servicoComSalaoId.arquivos.map((a, i)=> {
            formData.append(`arquivo_${i}`,a); 
        })

        const { data : res } = yield call(
            api[behavior === 'create' ? 'post' : 'put'],
            behavior === 'create' ? `/servico` : `/servico/${servicoComSalaoId._id}`, 
            formData,
            );
        
        yield put(updateServico({ form : {...form, saving: false} }));
 
        if(res.error){
            alert(res.message);
            return false;
        }

        yield put(allServicosAction());
        yield put(updateServico({ components : {...components, drawer: false} }));
        yield put(resetServico());

    } catch (error) {
        yield put(updateServico({ form : {...form, saving: false} }));
        alert(error.message);
    }

}

export function* removeServico() {
    
    const { form, servico , components } = yield select((state) => state.servico);
    try {
        yield put(updateServico({ form : {...form, saving: true} }));
        const { data: res } = yield call(api.delete, `/servico/${servico._id}`);

        yield put(updateServico({ form : {...form, saving: false, confirmDelete: false} }));

        if(res.error){
            alert(res.message);
            return false;
        }
        yield put(allServicosAction());
        yield put(updateServico({ components : {...components, drawer: false, confirmDelete: false} }));
        yield put(resetServico());


    } catch (error) {
        yield put(updateServico({ form : {...form, saving: false} }));
        alert(error.message);
    }

}

export function* removeArquivo({payload}) {
    
    const { form  } = yield select((state) => state.servico);
    try {
        yield put(updateServico({ form : {...form, saving: true} }));
        const { data: res } = yield call(api.post, `/servico/delete-arquivo/`,{
            payload,
        });

        yield put(updateServico({ form : {...form, saving: false} }));

        if(res.error){
            alert(res.message);
            return false;
        }

    } catch (error) {
        yield put(updateServico({ form : {...form, saving: false} }));
        alert(error.message);
    }

}

export default all([
    takeLatest(types.ALL_SERVICOS, allServicos),
    takeLatest(types.ADD_SERVICO, addServico),
    takeLatest(types.REMOVE_SERVICO, removeServico),
    takeLatest(types.REMOVE_ARQUIVO, removeArquivo)
]);