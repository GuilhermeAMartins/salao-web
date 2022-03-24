import types from './types';

export function allColaboradores(){
    return {type: types.All_COLABORADORES};
}

export function updateColaborador(payload){
    return {type: types.UPDATE_COLABORADOR , payload};
}

export function filterColaborador(){
    return {type: types.FILTER_COLABORADOR};
}

export function addColaborador(){
    return {type: types.ADD_COLABORADOR};
}

export function resetColaborador(){
    return {type: types.RESET_COLABORADOR};
}

export function unlinkColaborador(){
    return {type: types.UNLINK_COLABORADOR};
}

export function allServicos(){
    return {type: types.ALL_SERVICOS};
}