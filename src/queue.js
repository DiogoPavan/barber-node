import 'dotenv/config';

import Queue from './lib/Queue';

/**
 * Esse arquivo serve para separar a execução da fila da execução da aplicação
 * Fila pode estar em outro processador, usando outros recursos e desse jeito
 * nao vai influenciar na performance da aplicação
 */
Queue.processQueue();
