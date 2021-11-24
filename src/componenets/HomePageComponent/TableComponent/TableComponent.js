import React from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from "@material-ui/core/Paper";
import moment from 'moment';


function TableComponent(props) {
    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Plate </TableCell>
                            <TableCell align="right">Latest&nbsp;maintainence</TableCell>
                            <TableCell align="right">State</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.rows.map((row) => {
                            let str = row.maintenances[0];
                            let date = moment(str);
                            var dateComponent = date.utc().format('YYYY-MM-DD');
                            return (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.plate_no}
                                    </TableCell>
                                    <TableCell align="right">{
                                        dateComponent
                                    }</TableCell>
                                    <TableCell align="right">{row.plate_str}</TableCell>

                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

        </>
    )
}
export default TableComponent
