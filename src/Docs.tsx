import React from "react";
import { main } from "./doc_utils";
import CodeBlock from "./CodeBlock";
import Markdown from "./Markdown";
import { useLocation } from "react-router-dom";
import {
  Link,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Card,
  CardHeader,
  CardContent,
  Drawer,
  Button
} from "@material-ui/core";
import "./Docs.css";

interface Props {
  source: string;
}

export default function Docs(props: Props) {
  const location = useLocation();
  const docs = main(location.pathname, props.source);

  return (
    <div className="docs">
      <nav className="sidebar">
        <Drawer variant="permanent" anchor="left" open={true}>
          {docs.map((d, i) => {
            return (
              <ListItem key={i}>
                <a href={`?doc#${d.name}`}>{d.name}</a>
              </ListItem>
            );
          })}
        </Drawer>
      </nav>
      {docs.map(d => {
        const href = "?doc#" + d.name;
        const title = (
          <Link href={href} color="inherit">
            <code>{d.name}</code>
          </Link>
        );
        const subheader = (
          <span>
            {d.kind} <code>{d.typestr}</code>
          </span>
        );
        let frag = location.hash.substr(1);
        const raised = frag === d.name;
        let docstr = null;
        if (d.docstr) {
          docstr = <Markdown source={d.docstr} />;
        }
        let args = null;
        if (d.args) {
          args = (
            <p>
              <b>Arguments</b>
              <List>
                {d.args.map(arg => {
                  let name = <code>{`${arg.name}: ${arg.typestr}`}</code>;
                  let docstr = arg.docstr ? (
                    <Markdown source={arg.docstr} />
                  ) : null;
                  return (
                    <ListItem>
                      <ListItemText primary={name} secondary={docstr} />
                    </ListItem>
                  );
                })}
              </List>
            </p>
          );
        }
        let ret = null;
        if (d.retType) {
          ret = (
            <p>
              <b>Return Type</b> {d.retType}
            </p>
          );
        }
        return (
          <Box key={d.name} my={3} id={d.name}>
            <Card raised={raised}>
              <CardHeader title={title} subheader={subheader} />
              <CardContent>
                {docstr}
                {args}
                {ret}
                {/*
                  <CodeBlock language="json" value={JSON.stringify(d, null, 1)} />
                  */}
              </CardContent>
            </Card>
          </Box>
        );
      })}
    </div>
  );
}
