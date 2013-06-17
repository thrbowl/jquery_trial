# -*- coding: utf-8 -*-
import os
import shutil
import sqlite3
#for test sqlite3
#create table run_test(
#    exe_case_id integer not null UNIQUE,
#    retcode integer not null,
#    error_msg varchar(255),
#);

if not os.path.isfile('weblars.db'):
    shutil.copy('weblars.db.tpl', 'weblars.db')

def select(exe_case_id):
    conn = sqlite3.connect('weblars.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    try:
        sql = "SELECT * FROM run_test WHERE exe_case_id=?"
        cursor.execute(sql, (exe_case_id,))
        result = cursor.fetchone()
    except:
        result = None
    finally:
        cursor.close()
        conn.close()
    return result

def insert(exe_case_id, retcode, error_msg):
    conn = sqlite3.connect('weblars.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    try:
        sql = "INSERT INTO run_test (exe_case_id,retcode,error_msg) VALUES (?,?,?)"
        cursor.execute(sql, (exe_case_id, retcode, error_msg))
        conn.commit()
    except:
        pass
    finally:
        cursor.close()
        conn.close()

