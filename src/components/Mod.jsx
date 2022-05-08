import React from 'react';
import { open } from '@tauri-apps/api/shell';
import { Download, BoxArrowUpRight } from 'react-bootstrap-icons';

import Grid from '/voxeliface/components/Grid';
import Image from '/voxeliface/components/Image';
import Button from '/voxeliface/components/Button';
import Spinner from '/voxeliface/components/Spinner';
import Typography from '/voxeliface/components/Typography';
import BasicSpinner from '/voxeliface/components/BasicSpinner';

import API from '../common/api';
import Instances from '../common/instances';
export default function Mod({ data, instance, featured, recommended }) {
    const Instance = Instances.instances?.[instance];
    const { config, downloading } = Instance ?? {};
    const installed = config?.modifications.some(m => m[3] === data?.slug);
    const installing = downloading?.some(d => d.id === (data?.id ?? data?.project_id));
    const installMod = () => Instance.downloadMod(data?.id ?? data?.project_id, data.source ? API[data.source] : API.Modrinth);
    return (
        <Grid padding="8px" background="$secondaryBackground2" borderRadius={8} css={{ position: 'relative' }}>
            {data ? <React.Fragment>
                <Image src={data.icon_url} size={48} borderRadius={4} css={{
                    minWidth: '48px',
                    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',

                    '&:hover': {
                        zIndex: 2,
                        border: '#ffffff26 solid 1px',
                        transform: 'scale(2) translate(25%, 25%)',
                        backgroundColor: '#262626'
                    }
                }}/>
                <Grid margin="4px 0 0 12px" padding="2px 0" spacing="2px" direction="vertical">
                    <Typography size="1.1rem" color="$primaryColor" family="Nunito" lineheight={1}>
                        {data.title}
                        {data.author && 
                            <Typography size=".7rem" color="$secondaryColor" margin="4px 0 0 4px" lineheight={1}>
                                by {data.author}
                            </Typography>
                        }
                        {featured &&
                            <Typography size=".8rem" color="#cbc365" margin="2px 0 0 6px" lineheight={1}>
                                Featured
                            </Typography>
                        }
                        {recommended &&
                            <Typography size=".8rem" color="$secondaryColor" margin="2px 0 0 6px" lineheight={1}>
                                Recommended
                            </Typography>
                        }
                    </Typography>
                    <Typography size=".8rem" color="$secondaryColor" weight={400} family="Nunito" lineheight={1}>
                        {(data.client_side !== "unsupported" &&
                            data.server_side !== "unsupported") ?
                            "Universal mod"
                        : data.client_side !== "unsupported" ?
                            "Client mod" :
                            data.server_side !== "unsupported" ?
                            "Server mod" : "Unavailable"
                        }
                    </Typography>
                    <Typography size=".9rem" color="$secondaryColor" family="Nunito" textalign="left">
                        {data.description}
                    </Typography>
                </Grid>
                <Grid spacing="8px" css={{
                    right: 8,
                    position: 'absolute'
                }}>
                    {data.downloads && <Typography color="$primaryColor" margin="0 8px 0 0" family="Nunito">
                        {Intl.NumberFormat('en-us', {}).format(data.downloads)}
                        <Typography size=".8rem" text="Downloads" color="$secondaryColor" family="Nunito" margin="0 0 0 4px"/>
                    </Typography>}
                    {data.website_url &&
                        <Button theme="secondary" onClick={() => open(data.website_url)}>
                            <BoxArrowUpRight/>
                            Visit Website
                        </Button>
                    }
                    {typeof instance === "number" &&
                        <Button onClick={installMod} disabled={data.client_side === "unsupported" || installing || downloading.length > 0 || installed}>
                            {(installing || downloading.length > 0) ?
                                <BasicSpinner size={16}/> : <Download/>
                            }
                            {installed ? "Installed" : data.client_side === "unsupported" ? "Unavailable" :
                                installing ? "Installing" : downloading.length > 0 ? "Waiting" : "Install"
                            }
                        </Button>
                    }
                </Grid>
            </React.Fragment> : <Spinner/>}
        </Grid>
    );
};