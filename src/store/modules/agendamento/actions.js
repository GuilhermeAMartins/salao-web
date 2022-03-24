import types from './types'

export function filterAgendamento(start, end){
    return {
        type: types.FILTER_AGENDAMENTOS,
        start,
        end,
    };
}

export function updateAgendament(agendamentos){
    return { type: types.UPDATE_AGENDAMENTO, agendamentos};
}