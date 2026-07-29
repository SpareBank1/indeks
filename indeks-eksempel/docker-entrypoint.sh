#!/usr/bin/env bash
# Kjører Playwright og gir output tilbake til host-brukeren på vei ut, slik at
# root-containeren aldri etterlater seg filer host-brukeren ikke eier.
# Leser eierskapet til den bind-mountede arbeidskatalogen (eid av host-brukeren)
# i stedet for å stole på en HOST_UID-env – da virker det uansett hvordan
# containeren startes (også rå `docker compose run`).
reclaim() {
    owner="$(stat -c '%u:%g' .)"
    chown -R "$owner" test-results playwright-report 2>/dev/null || true
}
trap reclaim EXIT
npx playwright test "$@"
