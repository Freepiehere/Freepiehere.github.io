import requests
import pandas as pd
import json
import csv
from ast import literal_eval

df = pd.read_csv("Local_Law_Enforcement_Locations.csv")
saved_column = df.NAME
counties = {}

with open("Agencies.sql",'r') as agencies:
    for i in range(27):
        sample=agencies.readline()
    fault_count = []    
    while sample:
        found = False
        sample =agencies.readline()
        if sample == "INSERT INTO USCounties VALUES": 
            continue
        sample=sample.strip()[1:-2]
        
        result = [x for x in sample.split(",")]
        name = result[0][1:-1].upper()

        for i in range(len(saved_column)):
            agency = saved_column[i]
            if name in agency:
                county = df.COUNTY[i]
                if not name in counties.keys():
                    counties[county]=[]
                counties[county].append(result)
                break
            
        if not found:
            print(name,False)
            fault_count.append(name)
    
    for key in counties.keys():
        
    print(fault_count)
    print(str(len(fault_count))+ " depertments not found")

            

        
        




