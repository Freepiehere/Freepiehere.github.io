import requests
import pandas as pd
import json
import csv
from ast import literal_eval
   
def main():
    df = pd.read_csv("Local_Law_Enforcement_Locations.csv")
    saved_column = df.NAME
    counties_column = df.COUNTY
    counties = {}
    for county in counties_column:
        counties[county]=[]
    
    with open("Agencies.sql",'r') as agencies:
        for i in range(27):
            sample=agencies.readline()
    
        fault_count = []
        while sample:
            found = False
            sample = agencies.readline()
            if sample == "INSERT INTO USCounties VALUES": 
                continue
            sample=sample.strip()[1:-2]
        
            result = [x for x in sample.split(",")]
            name = result[0][1:-1].upper()
            stats = result[2:]
            for i in range(len(stats)):
                stat = stats[i]
                if stat=='NULL':
                    stats[i] = float(0)
                else:
                    stats[i] = float(stat)


            for i in range(len(saved_column)):
                agency = saved_column[i]
                if name in agency:
                    county = df.COUNTY[i]
                    counties[county].append(stats)
                    found=True
                    break
                #counties[ 
            if not found:
                print(name,False)
                fault_count.append(name)
      

    print(str(len(fault_count))+ " depertments not found")
    
    with open("Counties.sql","w+") as Counties_data:
        Counties_data.write("""CREATE TABLE IF NOT EXISTS CountyCrime (\n
        'Agency' VARCHAR(45) CHARACTER SET utf8,\n
        'Months' INT,\n
        'Population' INT,\n
        'Violent_crime_total' INT,\n
        'Murder_and_nonnegligent_Manslaughter' INT,\n
        'Legacy_rape_1' INT,\n
        'Legacy_rape_2' INT,\n
        'Robbery' INT,\n
        'Aggravated_assault' INT,\n
        'Property_crime_total' INT,\n
        'Burglary' INT,\n
        'Larceny_theft' INT,\n
        'Motor_vehicle_theft' INT,\n
        'Violent_Crime_rate' NUMERIC(5,1),\n
        'Murder_and_nonnegligent_manslaughter_rate' NUMERIC(4,1),\n
        'Legecy_rape_rate_1' NUMERIC(4,1),\n
        'Revised_rape_rate_2' NUMERIC(5,1),\n
        'Robbery_rate' NUMERIC(4,1),\n
        'Aggravated_assault_rate' NUMERIC(5,1),\n
        'Property_crime_rate' NUMERIC(6,1),\n
        'Burglary_rate' NUMERIC(5,1),\n
        'Larceny_theft_rate' NUMERIC(6,1),\n
        'Motor_vehicle_theft_rate' NUMERIC(5,1)\n
        );\n
        INSERT INTO CountyCrime VALUES\n""")
        string=""
        for key in counties.keys():
            data_list = combine(counties[key])
            string += "("+key
            for stat in data_list:
                string+=","+str(stat)
            string+="),\n"
        string=string[:-1]
        string+=";"
        Counties_data.write(string)
def combine(county_arrays):
    if not county_arrays:
        return []
    N = len(county_arrays)
    county_average = [0 for i in range(len(county_arrays[0]))]
    for agency_stat in county_arrays:
        for i in range(len(agency_stat)):
            element=agency_stat[i]
            county_average[i]+=element
    for i in range(len(county_average)):
        county_average[i]/=N
    return county_average
    

if __name__ == "__main__":
    main()
    combine([[1,2,3],[4,5,6]])
            

        
        




