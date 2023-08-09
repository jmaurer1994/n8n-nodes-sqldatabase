import type { AllEntities, Entity, PropertiesOf } from 'n8n-workflow';

type SqlDatabaseMap = {
    statement: 'execute' ;
}

export type SqlDatabase = AllEntities<SqlDatabaseMap>;

export type SqlDatabaseStatement = Entity<SqlDatabaseMap, 'statement'>;

export type StatementProperties = PropertiesOf<SqlDatabaseStatement>;