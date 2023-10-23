import { useContext, useEffect, useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import CodeHistory from '../../models/interfaces/codeHistory.interface';

import CodeHistoryService from '../../services/codeHistory.service';
import { CodeHistoryContext } from '../contexts/CodeHistoryContext';
import { Divider, Grid, Paper, Stack } from '@mui/material';

const codeHistoryService = CodeHistoryService.getInstance();

export default function CodeHistoryList() {
  const { codeId, updateCodeHistoryList } = useContext(CodeHistoryContext);

  const [codeHistories, setCodeHistories] = useState([] as CodeHistory[]);

  useEffect(() => {
    if (codeId.get > 0) {
      codeHistoryService.getAllByCodeId(codeId.get).then((list) => {
        setCodeHistories(list);
      });
    }
  }, [updateCodeHistoryList.get, codeId.get]);

  return (
    <>
      {codeHistories.length > 0 ? (
        <Grid container style={{ height: '100%', overflowY: 'auto' }}>
          <Stack>
            <Divider />
            {codeHistories.map((ch) => (
              <>
                <Paper>
                  <p>
                    <b>{ch.comment}</b>
                  </p>
                  <p>{ch.timestamp.toString()}</p>
                </Paper>
                <Divider />
              </>
            ))}
          </Stack>
        </Grid>
      ) : (
        <p>The repository is empty</p>
      )}
    </>
  );
}
