const db = require('./db');
const helper = require('../helper');

/* GET api/device-categories/manufacturers */
/* get manufecturers info from a DB */
async function getManufacturers() {
    const rows = await db.query(
        `SELECT node.id, node.title, (COUNT(parent.title) - 1) AS depth
         FROM device_categories AS node,
              device_categories AS parent
         WHERE node.lft BETWEEN parent.lft AND parent.rgt
         GROUP BY node.title
         HAVING depth = 1
         ORDER BY node.lft`);

    const data = helper.emptyArrOrRows(rows);

    return {
        data
    };
}

/* GET api/device-categories/manufacturers-models/:id */
/* get manufecturers models info from a DB */
//rename it to getManufacturersModels
async function getModel(id) {
    const rows = await db.query(
        `SELECT node.id, node.title, node.counter_keyword as countersKeywords,
         (COUNT(parent.title) - (sub_tree.depth + 1)) AS depth,
         node.toner_keyword as tonerKeywords, node.drum_keyword as drumKeywords,
         node.waste_keyword as wasteKeywords, node.clean_keyword as cleanKeywords
         FROM device_categories AS node,
            device_categories AS parent,
            device_categories AS sub_parent,
            (
                SELECT node.title, (COUNT(parent.title) - 1) AS depth
                FROM device_categories AS node,
                     device_categories AS parent
                WHERE node.lft BETWEEN parent.lft AND parent.rgt
                      AND node.id = ?
                GROUP BY node.title
                ORDER BY node.lft
            ) AS sub_tree
         WHERE node.lft BETWEEN parent.lft AND parent.rgt
               AND node.lft BETWEEN sub_parent.lft AND sub_parent.rgt
               AND sub_parent.title = sub_tree.title
         GROUP BY node.title
         HAVING depth = 1
         ORDER BY node.lft`, [id]);

    const data = helper.emptyArrOrRows(rows);

    return {
        data
    };
}

async function updateCounterKeywords(id, keywords) {
    const result = await db.query(
       `UPDATE device_categories
        SET counter_keyword = ?
        WHERE id = ?`,
        [keywords, id]
    );

    let message = 'Error in editing keywords for a model №' + id;

    if (result.affectedRows) {
        message = 'Keywords for a model №' + id + ' edited successfully';
    }

    return {message};
}

module.exports = {
    getManufacturers,
    getModel,
    updateCounterKeywords
};