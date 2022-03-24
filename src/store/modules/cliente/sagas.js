import { all , takeLatest , call , put , select } from 'redux-saga/effects';
import types from './types';
import { updateCliente , allClients as allClientsAction , resetCliente } from './actions';
import api from '../../../services/api';
import consts from '../../../consts';

export function* allClients() {
    
    const { form } = yield select((state) => state.cliente);

    try {
        yield put(updateCliente({ form : {...form, filtering: true} }));
        const { data: res } = yield call(
            api.get, 
            `/cliente/salao/${consts.salaoId}`);

        yield put(updateCliente({ form : {...form, filtering: false} }));

        if(res.error){
            alert(res.message);
            return false;
        }

        yield put(updateCliente({ clientes: res.clientes }));
        
        
    } catch (error) {
        yield put(updateCliente({ form : {...form, filtering: false} }));
        alert(error.message);
    }

}
  
export function* filterClientes() {
    
    const { form, cliente } = yield select((state) => state.cliente);
    try {
        yield put(updateCliente({ form : {...form, filtering: true} }));
        const { data: res } = yield call(
            api.post, 
            `/cliente/filter`,
            { filters: {
                email: cliente.email,
                status: 'A',
            } 
        });

        yield put(updateCliente({ form : {...form, filtering: false} }));
        
        if(res.error){
            alert(res.message);
            return false;
        }

        

        if(res.clientes.length > 0){
            yield put(updateCliente({ 
                cliente: res.clientes[0],
                form : {...form, filtering: false , disabled: true} }));
        }else{
            yield put(updateCliente({ form : {...form, disabled: false} }));
        }

        
    } catch (error) {
        yield put(updateCliente({ form : {...form, filtering: false} }));
        alert(error.message);
    }

}

export function* addCliente() {
    
    const { form, cliente , components } = yield select((state) => state.cliente);
    try {
        yield put(updateCliente({ form : {...form, saving: true} }));
        const { data: res } = yield call(api.post, `/cliente`, {
            salaoId: consts.salaoId,
            cliente
        });

        yield put(updateCliente({ form : {...form, saving: false} }));

        if(res.error){
            alert(res.message);
            return false;
        }

        yield put(allClientsAction());
        yield put(updateCliente({ components : {...components, drawer: false} }));
        yield put(resetCliente());

    } catch (error) {
        yield put(updateCliente({ form : {...form, saving: false} }));
        alert(error.message);
    }

}

export function* unlinkCliente() {
    
    const { form, cliente , components } = yield select((state) => state.cliente);
    try {
        yield put(updateCliente({ form : {...form, saving: true} }));
        const { data: res } = yield call(api.delete, `/cliente/vinculo/${cliente.vinculoId}`);

        yield put(updateCliente({ form : {...form, saving: false, confirmDelete: false} }));

        if(res.error){
            alert(res.message);
            return false;
        }

        yield put(allClientsAction());
        yield put(updateCliente({ components : {...components, drawer: false, confirmDelete: false} }));
        yield put(resetCliente());


    } catch (error) {
        yield put(updateCliente({ form : {...form, saving: false} }));
        alert(error.message);
    }

}

export default all([
    takeLatest(types.All_CLIENTES, allClients),
    takeLatest(types.FILTER_CLIENTES, filterClientes),
    takeLatest(types.ADD_CLIENTE, addCliente),
    takeLatest(types.UNLINK_CLIENTE, unlinkCliente),

]);