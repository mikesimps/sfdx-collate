#!/bin/bash
bin/run collate:compare:files  -p test/examples/PermissionSet1.xml -s test/examples/PermissionSet2.xml > permissionset_default.csv
bin/run collate:compare:files  -p test/examples/PermissionSet1.xml -s test/examples/PermissionSet2.xml -m full > permissionset_full.csv
bin/run collate:compare:files  -p test/examples/PermissionSet1.xml -s test/examples/PermissionSet2.xml -m diff > permissionset_diff.csv
bin/run collate:compare:files  -p test/examples/PermissionSet1.xml -s test/examples/PermissionSet2.xml -m exact > permissionset_exact.csv
bin/run collate:compare:files  -p test/examples/PermissionSet1.xml -s test/examples/PermissionSet2.xml -m inner > permissionset_inner.csv

bin/run collate:compare:build -f permissionset_default.csv > permissionset_default_build.xml

bin/run collate:compare:files  -p test/examples/SharingRules1.sharingRules -s test/examples/SharingRules2.sharingRules > sharingrule_default.csv
bin/run collate:compare:files  -p test/examples/SharingRules1.sharingRules -s test/examples/SharingRules2.sharingRules -m full > sharingrule_full.csv
bin/run collate:compare:files  -p test/examples/SharingRules1.sharingRules -s test/examples/SharingRules2.sharingRules -m diff > sharingrule_diff.csv
bin/run collate:compare:files  -p test/examples/SharingRules1.sharingRules -s test/examples/SharingRules2.sharingRules -m exact > sharingrule_exact.csv
bin/run collate:compare:files  -p test/examples/SharingRules1.sharingRules -s test/examples/SharingRules2.sharingRules -m inner > sharingrule_inner.csv

bin/run collate:compare:build -f sharingrule_default.csv > sharingrule_default_build.xml

bin/run collate:fetch:packagexml -x