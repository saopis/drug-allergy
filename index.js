require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const { PORT, hosConnectionPool, centralConnectionPool, HPCODE } = require('./configs');
const app = express();
const cors = require('cors');
const dayjs = require('dayjs');
var buddhistEra = require("dayjs/plugin/buddhistEra");
dayjs.extend(buddhistEra);
require('dayjs/locale/th')
dayjs.locale('th')

app.use(cors());
app.use(express.json());


async function drugallergy_first_sync() {
    try {
        console.log('================BEGIN FIRST SYNC DRUG_ALLERGY====================');
        console.log(dayjs().format('DD-MM-BBBB HH:mm:ss'));
        console.log('====================================');
        let [opdAllergyFromHosArray] = await hosConnectionPool.execute(`SELECT p.cid,o.agent,p.hcode,o.update_datetime FROM opd_allergy o INNER JOIN patient p ON o.hn=p.hn `);
        if (opdAllergyFromHosArray.length > 0) {
            for (const opdAllergyFromHos of opdAllergyFromHosArray) {
                let cid = opdAllergyFromHos.cid;
                let agent = opdAllergyFromHos.agent;
                let hcode = opdAllergyFromHos.hcode;
                let update_datetime = opdAllergyFromHos.update_datetime;
                let [dgAllergyFromCentralArray] = await centralConnectionPool.execute(`SELECT o.drugname FROM dg_allergy o WHERE o.cid=? AND o.drugname=? AND o.hcode=?`, [cid, agent, hcode]);
                if (dgAllergyFromCentralArray.length < 1) {
                    let [opdAllergyFromHosArray] = await hosConnectionPool.execute("SELECT p.cid,CONCAT(p.pname,p.fname,' ',p.lname) AS fulname,p.birthday,p.addrpart,p.road,p.moopart,p.tmbpart,p.amppart,p.chwpart,'' AS addre,o.agent,o.symptom,o.relation_level,o.report_date,p.hcode AS hcode_n FROM opd_allergy o LEFT JOIN patient p ON o.hn=p.hn LEFT JOIN thaiaddress t1 ON CONCAT(p.chwpart,p.amppart,p.tmbpart)=t1.addressid WHERE p.cid=? AND o.agent=? AND p.hcode=? AND p.cid<>'' AND p.fname<>''", [cid, agent, hcode]);
                    for (const opdAllergyFromHos of opdAllergyFromHosArray) {
                        let cids = opdAllergyFromHos.cid;
                        let fulname = opdAllergyFromHos.fulname;
                        let birthday = opdAllergyFromHos.birthday;
                        let addrpart = opdAllergyFromHos.addrpart;
                        let road = opdAllergyFromHos.road;
                        let moopart = opdAllergyFromHos.moopart;
                        let tmbpart = opdAllergyFromHos.tmbpart;
                        let amppart = opdAllergyFromHos.amppart;
                        let chwpart = opdAllergyFromHos.chwpart;
                        let addre = opdAllergyFromHos.addre;
                        let agents = opdAllergyFromHos.agent;
                        let symptom = opdAllergyFromHos.symptom;
                        let relation_level = opdAllergyFromHos.relation_level;
                        let report_date = opdAllergyFromHos.report_date;
                        let hcode_n = opdAllergyFromHos.hcode_n;
                        await centralConnectionPool.execute(
                            "INSERT INTO dg_allergy (`cid`, `pname`, `ages`, `nhome`, `roads`, `moo`, `tumbol`, `ampur`, `pvince`, `addre`, `drugname`, `smptom`, `level`, `datekey`, `hcode`, `actives`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Y')",
                            [cids, fulname, birthday, addrpart, road, moopart, tmbpart, amppart, chwpart, addre, agents, symptom, relation_level, report_date, hcode_n]
                        )
                        console.log('================INSERT SUCCESSFULLY!!====================');
                        console.log({
                            update_datetime,
                            hcode_n,
                            cids,
                            agents,
                            message: $update_datetime + " : " + $hcode_n + " " + $cids + "=" + $agents,
                        });
                        console.log('====================================');
                    }
                }
            }
        }
        console.log('=================DONE FIRST SYNC DRUG_ALLERGY SUCCESSFULLY!===================');
        console.log(dayjs().format('DD-MM-BBBB HH:mm:ss'));
        console.log('====================================');
    } catch (error) {
        console.log(error);
    }
}

async function drugallergy_sync() {
    try {
        console.log('================BEGIN SYNC DRUG_ALLERGY====================');
        console.log(dayjs().format('DD-MM-BBBB HH:mm:ss'));
        console.log('====================================');
        let [opdAllergyFromHosArray] = await hosConnectionPool.execute(`SELECT p.cid,o.agent,p.hcode,o.update_datetime FROM opd_allergy o INNER JOIN patient p ON o.hn=p.hn WHERE o.update_datetime >= (SELECT CONCAT(date(NOW() - INTERVAL 5 DAY),' 00:00:01') ) `);
        if (opdAllergyFromHosArray.length > 0) {
            for (const opdAllergyFromHos of opdAllergyFromHosArray) {
                let cid = opdAllergyFromHos.cid;
                let agent = opdAllergyFromHos.agent;
                let hcode = opdAllergyFromHos.hcode;
                let update_datetime = opdAllergyFromHos.update_datetime;
                let [dgAllergyFromCentralArray] = await centralConnectionPool.execute(`SELECT o.drugname FROM dg_allergy o WHERE o.cid=? AND o.drugname=? AND o.hcode=?`, [cid, agent, hcode]);
                if (dgAllergyFromCentralArray.length < 1) {
                    let [opdAllergyFromHosArray] = await hosConnectionPool.execute("SELECT p.cid,CONCAT(p.pname,p.fname,' ',p.lname) AS fulname,p.birthday,p.addrpart,p.road,p.moopart,p.tmbpart,p.amppart,p.chwpart,'' AS addre,o.agent,o.symptom,o.relation_level,o.report_date,p.hcode AS hcode_n FROM opd_allergy o LEFT JOIN patient p ON o.hn=p.hn LEFT JOIN thaiaddress t1 ON CONCAT(p.chwpart,p.amppart,p.tmbpart)=t1.addressid WHERE p.cid=? AND o.agent=? AND p.hcode=? AND p.cid<>'' AND p.fname<>''", [cid, agent, hcode]);
                    for (const opdAllergyFromHos of opdAllergyFromHosArray) {
                        let cids = opdAllergyFromHos.cid;
                        let fulname = opdAllergyFromHos.fulname;
                        let birthday = opdAllergyFromHos.birthday;
                        let addrpart = opdAllergyFromHos.addrpart;
                        let road = opdAllergyFromHos.road;
                        let moopart = opdAllergyFromHos.moopart;
                        let tmbpart = opdAllergyFromHos.tmbpart;
                        let amppart = opdAllergyFromHos.amppart;
                        let chwpart = opdAllergyFromHos.chwpart;
                        let addre = opdAllergyFromHos.addre;
                        let agents = opdAllergyFromHos.agent;
                        let symptom = opdAllergyFromHos.symptom;
                        let relation_level = opdAllergyFromHos.relation_level;
                        let report_date = opdAllergyFromHos.report_date;
                        let hcode_n = opdAllergyFromHos.hcode_n;
                        await centralConnectionPool.execute(
                            "INSERT INTO dg_allergy (`cid`, `pname`, `ages`, `nhome`, `roads`, `moo`, `tumbol`, `ampur`, `pvince`, `addre`, `drugname`, `smptom`, `level`, `datekey`, `hcode`, `actives`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Y')",
                            [cids, fulname, birthday, addrpart, road, moopart, tmbpart, amppart, chwpart, addre, agents, symptom, relation_level, report_date, hcode_n]
                        )
                        console.log('================INSERT SUCCESSFULLY!!====================');
                        console.log({
                            update_datetime,
                            hcode_n,
                            cids,
                            agents,
                            message: $update_datetime + " : " + $hcode_n + " " + $cids + "=" + $agents,
                        });
                        console.log('====================================');
                    }
                }
            }
        }
        console.log('=================DONE SYNC DRUG_ALLERGY SUCCESSFULLY!===================');
        console.log(dayjs().format('DD-MM-BBBB HH:mm:ss'));
        console.log('====================================');
    } catch (error) {
        console.log(error);
    }
}

async function syncHN() {
    try {
        console.log('================BEGIN SYNC HN====================');
        console.log(dayjs().format('DD-MM-BBBB HH:mm:ss'));
        console.log('====================================');
        let daten1 = dayjs().format('YYYY-MM-DD');
        let daten2 = dayjs().format('YYYY-MM-DD HH:mm:ss');

        let [dgAllergyArray] = await centralConnectionPool.execute(`SELECT d.hcode,d.cid,d.drugname,d.smptom FROM dg_allergy d WHERE d.hcode<>'${HPCODE}' AND d.cid IS NOT null AND d.cid NOT IN ('','0000000000000','1111111111111','1111111111119') AND d.drugname NOT LIKE '%ckd%' AND d.drugname NOT IN ('DICLOFENAC','IBUPROFEN','IBUPROFENSYR.','INDOMETHACIN','MEFENAMICACID','METFORMIN','MILK OF MAGNESIA') ORDER BY d.hcode`);
        console.log('====================================');
        console.log(HPCODE);
        console.log('====================================');
        if (dgAllergyArray.length > 0) {
            for (const dgAllergy of dgAllergyArray) {
                let hcodehos = dgAllergy.hcode;
                let cidhos = dgAllergy.cid;
                let drugnamehos = dgAllergy.drugname;
                let smptom = dgAllergy.smptom;
                let dgnote = "ระบบเชื่อมเครือข่าย " + hcodehos;
                console.log(dgAllergy);

                let [dataFromHosArray] = await hosConnectionPool.execute("SELECT p.hn FROM patient p WHERE p.cid='?'", [cidhos]);
                if (dataFromHosArray.length > 0) {
                    for (const dataFromHos of dataFromHosArray) {
                        let hnhos = dataFromHos.hn;
                        // console.log({ hnhos, daten1, drugnamehos, smptom, hcodehos, dgnote, daten1, opd: 'OPD', daten2, daten2, y: 'Y', one: '1', cidhos });

                        await hosConnectionPool.execute(`INSERT INTO opd_allergy (hn,report_date,agent,symptom,reporter,note,begin_date,department,entry_datetime,update_datetime,force_no_order,opd_allergy_alert_type_id,patient_cid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                            [hnhos, daten1, drugnamehos, smptom, hcodehos, dgnote, daten1, 'OPD', daten2, daten2, 'Y', '1', cidhos]
                        )
                        console.log('================INSERT SUCCESSFULLY!!====================');
                        console.log(`${hnhos} = ${drugnamehos}`);
                        console.log('====================================');
                    }
                }
            }
        }

        let [patientArray] = await hosConnectionPool.execute("SELECT DISTINCT(pt.hn) AS dhn FROM patient pt INNER JOIN opd_allergy oa ON pt.hn=oa.hn WHERE pt.drugallergy is NULL OR pt.drugallergy=''")
        if (patientArray.length > 0) {
            for (const patient of patientArray) {
                let dhn = patient.dhn;
                let [opdAllergy] = await hosConnectionPool.execute("SELECT GROUP_CONCAT(agent) AS gds FROM opd_allergy WHERE hn=?", [dhn]);
                for (const opd of opdAllergy) {
                    let gds = opd.gds;
                    await hosConnectionPool.execute("UPDATE patient SET drugallergy=? WHERE hn=?", [gds, dhn]);
                }
            }
        }
        console.log('================SYNC HN SUCCESSFULLY!!====================');
        console.log('================INSERT | drug To HOSxP | SUCCESSFULLY!!====================');
        console.log(dayjs().format('DD-MM-BBBB HH:mm:ss'));
        console.log('====================================');

    } catch (error) {
        console.log(error);
    }
}

cron.schedule('*/30 * * * *', async () => {
    await drugallergy_sync();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', async (req, res) => {
    let results = await drugallergy_first_sync();
    res.json(results);
});
app.get('/drugallergy_first_sync', async (req, res) => {
    let results = await drugallergy_first_sync();
    res.json(results);
});
app.get('/status', (req, res) => {
    res.send('Cron job is running');
});
app.get('/syncHN', async (req, res) => {
    await syncHN();
    res.send('Cron job is running');
});