#!/bin/bash
cd /opt/freeroam/apps/web
/usr/bin/node /opt/freeroam/apps/web/scripts/coletor.js >> /var/log/freeroam-coletor.log 2>&1
